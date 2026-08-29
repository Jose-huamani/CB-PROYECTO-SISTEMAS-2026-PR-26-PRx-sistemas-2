import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { RepositoryFunctionModel } from '@features/repositories/domain/models/repository-function.model';

export interface CreateRepositoryInvitationFormModel {
  invitedUserEmail: string;
  repositoryFunctionId: number | null;
  welcomeMessage: string;
}

interface BuildCreateRepositoryInvitationFormOptions {
  functionOptions: RepositoryFunctionModel[];
}

export function buildCreateRepositoryInvitationForm(
  options: BuildCreateRepositoryInvitationFormOptions,
): {
  form: FormGroup;
  model: CreateRepositoryInvitationFormModel;
  fields: FormlyFieldConfig[];
} {
  return {
    form: new FormGroup({}),
    model: {
      invitedUserEmail: '',
      repositoryFunctionId: null,
      welcomeMessage: '',
    },
    fields: buildFields(options),
  };
}

function buildFields(options: BuildCreateRepositoryInvitationFormOptions): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'invitedUserEmail',
          type: 'app-input',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Email del usuario',
            type: 'email',
            placeholder: 'ejemplo@correo.com',
            required: true,
            maxLength: 50,
            helperText: 'Ingresa un correo electrónico válido.',
          },
          validators: {
            validation: [Validators.email],
          },
        },
        {
          key: 'repositoryFunctionId',
          type: 'app-select',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Función en el repositorio',
            required: true,
            options: options.functionOptions.map((func) => ({
              ...func,
              name: func.name.charAt(0).toUpperCase() + func.name.slice(1),
            })),
            optionLabel: 'name',
            optionValue: 'id',
            placeholder: 'Selecciona una función',
            helperText: 'Define la función del colaborador.',
          },
        },
        {
          key: 'welcomeMessage',
          type: 'app-textarea',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Mensaje de bienvenida',
            placeholder: 'Escribe un mensaje breve...',
            required: false,
            maxLength: 2000,
            rows: 3,
            autoResize: true,
            helperText: 'Máximo 2000 caracteres (opcional).',
          },
        },
      ],
    },
  ];
}
