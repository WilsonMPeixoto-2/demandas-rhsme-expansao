import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'BOOTSTRAP_PASSWORD'];

export function getBootstrapUsers() {
  return [
    { nome: 'Wilson Peixoto', email: 'wilson.peixoto@rioeduca.net', nivel: 'administrador' },
    { nome: 'Jailson B. Silva', email: 'jailsonbsilva@rioeduca.net', nivel: 'administrador' },
    { nome: 'Perfil de teste', email: 'teste@rioeduca.net', nivel: 'editor' },
  ];
}

export function readBootstrapEnv(env) {
  for (const key of requiredEnv) {
    if (!env[key]?.trim()) throw new Error(`Variável obrigatória ausente: ${key}`);
  }
  return Object.fromEntries(requiredEnv.map((key) => [key, env[key]]));
}

export function loadInitialDemandas(sourcePath) {
  const source = readFileSync(sourcePath, 'utf8');
  const match = source.match(/export const initialDemandas:[^=]+=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) throw new Error('Não foi possível ler src/data/initialDemandas.ts.');
  return JSON.parse(match[1]);
}

function toDatabaseDate(value) {
  if (!value || value === 'dd/mm/aaaa') return null;
  const [day, month, year] = value.split('/');
  return `${year}-${month}-${day}`;
}

async function ensureUsers(client, password) {
  const { data, error } = await client.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  const knownUsers = [...data.users];
  const createdUsers = [];

  for (const definition of getBootstrapUsers()) {
    let user = knownUsers.find((candidate) => candidate.email?.toLowerCase() === definition.email);
    if (!user) {
      const result = await client.auth.admin.createUser({
        email: definition.email,
        password,
        email_confirm: true,
        user_metadata: { nome: definition.nome },
      });
      if (result.error || !result.data.user) throw result.error ?? new Error(`Falha ao criar ${definition.email}.`);
      user = result.data.user;
      knownUsers.push(user);
      createdUsers.push(user.id);
    } else {
      const result = await client.auth.admin.updateUserById(user.id, {
        email_confirm: true,
        user_metadata: { ...user.user_metadata, nome: definition.nome },
      });
      if (result.error) throw result.error;
    }

    const { data: existingProfile, error: profileCheckError } = await client
      .from('perfis_usuarios')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileCheckError) throw profileCheckError;
    
    if (!existingProfile) {
      const { error: profileError } = await client.from('perfis_usuarios').insert({
        id: user.id,
        nome: definition.nome,
        email: definition.email,
        setor: 'E/CTRH',
        nivel: definition.nivel,
        status: 'ativo',
      });
      if (profileError) throw profileError;
    }
  }

  return { users: knownUsers, createdUsers };
}

async function importDemandas(client, demandas) {
  const numeros = demandas.map((demanda) => demanda.numero);
  const { data: existing, error: existingError } = await client
    .from('sme_demandas')
    .select('numero')
    .in('numero', numeros);
  if (existingError) throw existingError;
  const existingNumbers = new Set((existing ?? []).map((row) => row.numero));
  let created = 0;

  for (const demanda of demandas) {
    if (existingNumbers.has(demanda.numero)) continue;
    
    // Inserção atômica via RPC, garantindo a atomicidade entre demanda e histórico
    const { error: rpcError } = await client.rpc('criar_sme_demanda', {
      p_numero: demanda.numero,
      p_tipo: demanda.tipo,
      p_assunto: demanda.assunto,
      p_responsavel: demanda.responsavel ?? '',
      p_limite1: toDatabaseDate(demanda.limite1),
      p_limite2: toDatabaseDate(demanda.limite2),
      p_status: demanda.status,
      p_setor: demanda.setor ?? '',
      p_classificacao: demanda.classificacao ?? '',
    });

    if (rpcError) throw rpcError;
    created += 1;
  }

  return created;
}

export async function runBootstrap(client, password, demandas) {
  await ensureUsers(client, password);
  
  // Autenticar com o email do administrador Wilson para estabelecer o contexto de auth.uid() nas RPCs
  const { error: authError } = await client.auth.signInWithPassword({
    email: 'wilson.peixoto@rioeduca.net',
    password: password
  });
  if (authError) throw authError;

  return importDemandas(client, demandas);
}

async function main() {
  const env = readBootstrapEnv(process.env);
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const here = dirname(fileURLToPath(import.meta.url));
  const demandas = loadInitialDemandas(resolve(here, '..', 'src', 'data', 'initialDemandas.ts'));
  const created = await runBootstrap(client, env.BOOTSTRAP_PASSWORD, demandas);
  console.log(`Bootstrap concluído: ${getBootstrapUsers().length} perfis preparados e ${created} demandas novas importadas.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Falha no bootstrap: ${error instanceof Error ? error.message : 'erro desconhecido'}`);
    process.exitCode = 1;
  });
}
