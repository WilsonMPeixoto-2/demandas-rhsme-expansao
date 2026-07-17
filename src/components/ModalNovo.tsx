import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Demanda } from '../types';
import { demandaFormSchema, type DemandaFormValues, statusValues, tipoValues } from '../validation/demandaSchemas';
import { DateMaskInput } from './DateMaskInput';
import { AppDialog } from './ui/AppDialog';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { FormError } from './ui/FormError';
import { classificacaoValues } from '../constants/demandaOptions';

interface ModalNovoProps {
  onClose: () => void;
  onSalvar: (demanda: Omit<Demanda, 'id'>) => void | Promise<void>;
}

export const ModalNovo: React.FC<ModalNovoProps> = ({ onClose, onSalvar }) => {
  const [confirmClose, setConfirmClose] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<DemandaFormValues>({
    resolver: zodResolver(demandaFormSchema),
    defaultValues: {
      tipo: undefined,
      numero: '',
      assunto: '',
      responsavel: '',
      limite1: '',
      limite2: '',
      status: undefined,
      setor: '',
      classificacao: '',
    },
  });

  const requestClose = () => {
    if (isDirty && !isSubmitting) setConfirmClose(true);
    else onClose();
  };

  const submit = handleSubmit(async (values) => {
    await onSalvar(values);
  });

  return (
    <>
      <AppDialog title="Nova Demanda" onClose={requestClose}>
        <form onSubmit={(event) => { void submit(event); }} noValidate>
          <div className="modal-body">
            <div className="form-grid-modal">
              <div className="input-container-floating col-full">
                <select
                  id="novo-tipo"
                  {...register('tipo')}
                  className={errors.tipo ? 'field-invalid' : ''}
                  aria-invalid={Boolean(errors.tipo)}
                  aria-describedby={errors.tipo ? 'novo-tipo-error' : undefined}
                >
                  <option value="" />
                  {tipoValues.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
                <label htmlFor="novo-tipo">Tipo</label>
                <FormError id="novo-tipo-error" message={errors.tipo?.message} />
              </div>

              <div className="input-container-floating col-full">
                <input
                  type="text"
                  id="novo-numero"
                  placeholder=" "
                  {...register('numero')}
                  className={errors.numero ? 'field-invalid' : ''}
                  aria-invalid={Boolean(errors.numero)}
                  aria-describedby={errors.numero ? 'novo-numero-error' : undefined}
                />
                <label htmlFor="novo-numero">Número</label>
                <FormError id="novo-numero-error" message={errors.numero?.message} />
              </div>

              <div className="input-container-floating col-full">
                <input
                  type="text"
                  id="novo-assunto"
                  placeholder=" "
                  {...register('assunto')}
                  className={errors.assunto ? 'field-invalid' : ''}
                  aria-invalid={Boolean(errors.assunto)}
                  aria-describedby={errors.assunto ? 'novo-assunto-error' : undefined}
                />
                <label htmlFor="novo-assunto">Assunto</label>
                <FormError id="novo-assunto-error" message={errors.assunto?.message} />
              </div>

              <div className="input-container-floating col-full">
                <input type="text" id="novo-responsavel" placeholder=" " {...register('responsavel')} />
                <label htmlFor="novo-responsavel">Responsável</label>
              </div>

              <Controller
                name="limite1"
                control={control}
                render={({ field, fieldState }) => (
                  <DateMaskInput
                    id="novo-limite1"
                    label="Limite 1"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="limite2"
                control={control}
                render={({ field, fieldState }) => (
                  <DateMaskInput
                    id="novo-limite2"
                    label="Limite 2"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <div className="input-container-floating col-full">
                <select
                  id="novo-status"
                  {...register('status')}
                  className={errors.status ? 'field-invalid' : ''}
                  aria-invalid={Boolean(errors.status)}
                  aria-describedby={errors.status ? 'novo-status-error' : undefined}
                >
                  <option value="" />
                  {statusValues.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <label htmlFor="novo-status">Status</label>
                <FormError id="novo-status-error" message={errors.status?.message} />
              </div>

              <div className="input-container-floating col-full">
                <input type="text" id="novo-setor" placeholder=" " {...register('setor')} />
                <label htmlFor="novo-setor">Setor (ex: E/CTRH)</label>
              </div>

              <div className="input-container-floating col-full">
                <select
                  id="novo-classificacao"
                  {...register('classificacao')}
                  className={errors.classificacao ? 'field-invalid' : ''}
                  aria-invalid={Boolean(errors.classificacao)}
                  aria-describedby={errors.classificacao ? 'novo-classificacao-error' : undefined}
                >
                  <option value="" />
                  {classificacaoValues.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <label htmlFor="novo-classificacao">Selecione a classificação</label>
                <FormError id="novo-classificacao-error" message={errors.classificacao?.message} />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} aria-busy={isSubmitting}>
              <i className={`fa-solid ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} aria-hidden="true" />
              {isSubmitting ? 'Salvando…' : 'Salvar'}
            </button>
            <button type="button" className="btn" onClick={requestClose} disabled={isSubmitting}>
              <i className="fa-solid fa-xmark" aria-hidden="true" /> Cancelar
            </button>
          </div>
        </form>
      </AppDialog>

      <ConfirmDialog
        open={confirmClose}
        title="Descartar alterações?"
        description="Os dados preenchidos ainda não foram salvos. Ao sair, essas alterações serão perdidas."
        confirmLabel="Descartar alterações"
        onConfirm={onClose}
        onOpenChange={setConfirmClose}
      />
    </>
  );
};
