import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getUserFacingError } from '../domain/userFacingErrors';
import {
  accessRequestFormSchema,
  loginFormSchema,
  passwordRecoveryRequestSchema,
  type AccessRequestFormValues,
  type LoginFormValues,
  type PasswordRecoveryRequestValues,
} from '../validation/authSchemas';
import './AuthPanel.css';
import { FormError } from './ui/FormError';

interface AuthPanelProps {
  mode: 'local' | 'supabase';
  loading: boolean;
  onSignIn: (email: string, senha: string) => Promise<void>;
  onRequestAccess: (email: string, senha: string) => Promise<void>;
  onRequestPasswordReset: (email: string) => Promise<void>;
}

export function AuthPanel({
  mode,
  loading,
  onSignIn,
  onRequestAccess,
  onRequestPasswordReset,
}: AuthPanelProps) {
  const focusAfterSwitch = useRef(false);
  const recoveryHeading = useRef<HTMLHeadingElement>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'cadastro'>('login');
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryRequested, setRecoveryRequested] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showCadastroPassword, setShowCadastroPassword] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', senha: '' },
  });
  const cadastroForm = useForm<AccessRequestFormValues>({
    resolver: zodResolver(accessRequestFormSchema),
    defaultValues: { email: '', senha: '' },
  });
  const recoveryForm = useForm<PasswordRecoveryRequestValues>({
    resolver: zodResolver(passwordRecoveryRequestSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    if (!focusAfterSwitch.current) return;
    focusAfterSwitch.current = false;
    if (recoveryMode) {
      if (recoveryRequested) recoveryHeading.current?.focus();
      else recoveryForm.setFocus('email');
    } else if (activeTab === 'cadastro') cadastroForm.setFocus('email');
    else loginForm.setFocus('email');
  }, [activeTab, recoveryMode, recoveryRequested, loginForm, cadastroForm, recoveryForm]);

  const cadastroSenha = useWatch({ control: cadastroForm.control, name: 'senha' }) ?? '';
  const senhaValida = {
    minimo: cadastroSenha.length >= 8,
    maiuscula: /[A-Z]/.test(cadastroSenha),
    minuscula: /[a-z]/.test(cadastroSenha),
    numero: /[0-9]/.test(cadastroSenha),
  };

  const submitLogin = loginForm.handleSubmit(async (values) => {
    try {
      await onSignIn(values.email, values.senha);
    } catch (reason) {
      toast.error(getUserFacingError(reason, 'Não foi possível entrar.'));
    }
  });

  const submitCadastro = cadastroForm.handleSubmit(async (values) => {
    try {
      await onRequestAccess(values.email, values.senha);
      toast.success(mode === 'local'
        ? 'Solicitação simulada com sucesso. Você já pode entrar com sua conta.'
        : 'Solicitação enviada. Aguarde a aprovação de um administrador.');
      loginForm.reset({ email: values.email, senha: '' });
      cadastroForm.reset();
      focusAfterSwitch.current = true;
      setActiveTab('login');
    } catch (reason) {
      toast.error(getUserFacingError(reason, 'Não foi possível solicitar acesso.'));
    }
  });

  const submitRecovery = recoveryForm.handleSubmit(async (values) => {
    try {
      await onRequestPasswordReset(values.email);
      focusAfterSwitch.current = true;
      setRecoveryRequested(true);
    } catch (reason) {
      toast.error(getUserFacingError(reason, 'Não foi possível enviar o link de recuperação agora.'));
    }
  });

  const openRecovery = () => {
    focusAfterSwitch.current = true;
    recoveryForm.reset({ email: loginForm.getValues('email') });
    setRecoveryRequested(false);
    setRecoveryMode(true);
  };

  const closeRecovery = () => {
    focusAfterSwitch.current = true;
    setRecoveryMode(false);
    setRecoveryRequested(false);
    setActiveTab('login');
  };

  return (
    <main className="monumental-login" aria-label="Acesso ao Fluxo CTRH">
      <figure className="monumental-login-art">
        <img
          src="/design/login-canonico-painel-esquerdo.png"
          width="1086"
          height="992"
          fetchPriority="high"
          decoding="sync"
          alt="Arcos da Lapa iluminados em âmbar, Cristo Redentor ao fundo e assinatura Prefeitura do Rio de Janeiro — Educação."
        />
        <figcaption className="monumental-sr-only">
          <strong>Fluxo CTRH</strong> — Central de Demandas, Recursos Humanos.
          Gestão com clareza. Memória com propósito.
          Pessoas, processos e informações em um mesmo fluxo, a serviço da educação carioca.
        </figcaption>
      </figure>

      <section className="monumental-login-access" aria-labelledby="monumental-login-title">
        <svg className="monumental-login-lines" viewBox="0 0 500 992" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="0.65">
            <path d="M500 236C482 272 490 301 500 320M500 318C478 333 465 348 448 371M500 322C478 337 466 351 449 374M500 326C480 341 468 354 450 377M500 330C482 345 470 357 451 380M500 334C484 349 472 360 452 383M500 338C486 353 474 363 453 386" />
            <path d="M500 390C437 430 413 516 463 565S483 680 457 712M500 575C482 675 488 745 442 819S413 941 423 992M500 864C428 865 352 927 353 992M500 907C450 922 409 957 394 992M500 938C475 956 453 975 442 992" />
          </g>
        </svg>
        <p className="monumental-login-signature">Educação que<br />transforma<br />o Rio</p>
        <header className="monumental-login-heading">
          <h1 id="monumental-login-title">Bem-vindo ao<br />{' '}Fluxo CTRH</h1>
          <p>Acesse a Central de Demandas de Recursos Humanos da Secretaria Municipal de Educação do Rio de Janeiro.</p>
        </header>
        <div className="login-card-editorial monumental-login-card">
          {!recoveryMode && <div className="login-tabs" aria-label="Modalidade de acesso">
            <button
              type="button"
              aria-pressed={activeTab === 'login'}
              className={`login-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { focusAfterSwitch.current = true; setActiveTab('login'); }}
            >
              Entrar
            </button>
            <button
              type="button"
              aria-pressed={activeTab === 'cadastro'}
              className={`login-tab-btn ${activeTab === 'cadastro' ? 'active' : ''}`}
              onClick={() => { focusAfterSwitch.current = true; setActiveTab('cadastro'); }}
            >
              Primeiro acesso
            </button>
          </div>}

          {recoveryMode ? (
            <div className="auth-flow-content">
              <div className="auth-flow-heading">
                <h2 ref={recoveryHeading} tabIndex={-1}>{recoveryRequested ? 'Confira seu e-mail' : 'Recuperar acesso'}</h2>
                <p>
                  {recoveryRequested
                    ? 'Se houver uma conta vinculada a esse e-mail, você receberá um link para criar uma nova senha.'
                    : 'Informe seu e-mail institucional. O link terá validade limitada e poderá ser usado uma única vez.'}
                </p>
              </div>

              {recoveryRequested ? (
                <div className="auth-feedback" role="status">
                  <i className="fa-solid fa-envelope-circle-check" aria-hidden="true" />
                  <p>Verifique também a pasta de spam. Por segurança, esta confirmação é igual para todos os e-mails.</p>
                </div>
              ) : (
                <form onSubmit={(event) => { void submitRecovery(event); }} noValidate>
                  <div className="login-form-group">
                    <label htmlFor="recovery-email">E-mail corporativo para recuperação</label>
                    <div className="input-icon-group">
                      <input
                        type="email"
                        spellCheck={false}
                        id="recovery-email"
                        className={recoveryForm.formState.errors.email ? 'form-control field-invalid' : 'form-control'}
                        placeholder="usuario@rioeduca.net"
                        autoComplete="email"
                        {...recoveryForm.register('email')}
                        aria-invalid={Boolean(recoveryForm.formState.errors.email)}
                        aria-describedby={recoveryForm.formState.errors.email ? 'recovery-email-error' : undefined}
                      />
                    </div>
                    <FormError id="recovery-email-error" message={recoveryForm.formState.errors.email?.message} />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary auth-full-width"
                    disabled={loading || recoveryForm.formState.isSubmitting}
                    aria-busy={loading || recoveryForm.formState.isSubmitting}
                  >
                    {loading || recoveryForm.formState.isSubmitting ? 'Enviando…' : 'Enviar link de recuperação'}
                  </button>
                </form>
              )}

              <button type="button" className="auth-link-button auth-back-button" onClick={closeRecovery}>
                <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                Voltar para entrar
              </button>
            </div>
          ) : activeTab === 'login' ? (
            <form className="monumental-login-form" onSubmit={(event) => { void submitLogin(event); }} noValidate>
              <div className="login-form-group">
                <label htmlFor="login-email">E-mail corporativo</label>
                <div className="input-icon-group">
                  <input
                    type="email"
                    spellCheck={false}
                    id="login-email"
                    className={loginForm.formState.errors.email ? 'form-control field-invalid' : 'form-control'}
                    placeholder="usuario@rioeduca.net"
                    autoComplete="username"
                    {...loginForm.register('email')}
                    aria-invalid={Boolean(loginForm.formState.errors.email)}
                    aria-describedby={loginForm.formState.errors.email ? 'login-email-error' : undefined}
                  />
                </div>
                <FormError id="login-email-error" message={loginForm.formState.errors.email?.message} />
              </div>

              <div className="login-form-group">
                <label htmlFor="login-senha">Senha</label>
                <div className="input-icon-group has-visibility-toggle">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    id="login-senha"
                    className={loginForm.formState.errors.senha ? 'form-control field-invalid' : 'form-control'}
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    {...loginForm.register('senha')}
                    aria-invalid={Boolean(loginForm.formState.errors.senha)}
                    aria-describedby={loginForm.formState.errors.senha ? 'login-senha-error' : undefined}
                  />
                  <button
                    type="button"
                    className="password-visibility-toggle"
                    aria-label={showLoginPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    aria-pressed={showLoginPassword}
                    onClick={() => setShowLoginPassword((visible) => !visible)}
                  >
                    <i className={`fa-regular ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                  </button>
                </div>
                <FormError id="login-senha-error" message={loginForm.formState.errors.senha?.message} />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || loginForm.formState.isSubmitting}
                aria-busy={loading || loginForm.formState.isSubmitting}
              >
                <span>{loading || loginForm.formState.isSubmitting ? 'Acessando…' : 'Acessar sistema'}</span>
                <span aria-hidden="true">→</span>
              </button>
              <div className="auth-forgot-row">
                <button type="button" className="auth-link-button" onClick={openRecovery}>
                  Esqueci minha senha
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={(event) => { void submitCadastro(event); }} noValidate>
              <div className="login-form-group">
                <label htmlFor="cadastro-email">Seu e-mail corporativo</label>
                <div className="input-icon-group">
                  <input
                    type="email"
                    spellCheck={false}
                    id="cadastro-email"
                    className={cadastroForm.formState.errors.email ? 'form-control field-invalid' : 'form-control'}
                    placeholder="nome@rioeduca.net"
                    autoComplete="username"
                    {...cadastroForm.register('email')}
                    aria-invalid={Boolean(cadastroForm.formState.errors.email)}
                    aria-describedby={cadastroForm.formState.errors.email ? 'cadastro-email-error' : undefined}
                  />
                </div>
                <FormError id="cadastro-email-error" message={cadastroForm.formState.errors.email?.message} />
              </div>

              <div className="login-form-group">
                <label htmlFor="cadastro-senha">Criar nova senha</label>
                <div className="input-icon-group has-visibility-toggle">
                  <input
                    type={showCadastroPassword ? 'text' : 'password'}
                    id="cadastro-senha"
                    className={cadastroForm.formState.errors.senha ? 'form-control field-invalid' : 'form-control'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...cadastroForm.register('senha')}
                    aria-invalid={Boolean(cadastroForm.formState.errors.senha)}
                    aria-describedby={cadastroForm.formState.errors.senha ? 'cadastro-senha-error' : undefined}
                  />
                  <button
                    type="button"
                    className="password-visibility-toggle"
                    aria-label={showCadastroPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    aria-pressed={showCadastroPassword}
                    onClick={() => setShowCadastroPassword((visible) => !visible)}
                  >
                    <i className={`fa-regular ${showCadastroPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                  </button>
                </div>
                <FormError id="cadastro-senha-error" message={cadastroForm.formState.errors.senha?.message} />

                <div className="password-requirements" aria-label="Requisitos da senha">
                  <PasswordRequirement valid={senhaValida.minimo}>Mínimo de 8 caracteres</PasswordRequirement>
                  <PasswordRequirement valid={senhaValida.maiuscula}>Pelo menos uma letra maiúscula</PasswordRequirement>
                  <PasswordRequirement valid={senhaValida.minuscula}>Pelo menos uma letra minúscula</PasswordRequirement>
                  <PasswordRequirement valid={senhaValida.numero}>Pelo menos um número</PasswordRequirement>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || cadastroForm.formState.isSubmitting}
                aria-busy={loading || cadastroForm.formState.isSubmitting}
              >
                {loading || cadastroForm.formState.isSubmitting ? 'Enviando…' : 'Solicitar acesso'}
              </button>
            </form>
          )}
        </div>
        <details className="monumental-login-help">
          <summary><span aria-hidden="true">?</span>Precisa de ajuda?<span aria-hidden="true">→</span></summary>
          <p>Utilize seu e-mail @rioeduca.net. No primeiro acesso, solicite acesso e aguarde a aprovação de um administrador. Se já possui conta, use “Esqueci minha senha”.</p>
        </details>
      </section>
    </main>
  );
}

function PasswordRequirement({ valid, children }: { valid: boolean; children: string }) {
  return (
    <div className={`req-item ${valid ? 'valid' : ''}`}>
      <i className={valid ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
