import { ConfigOption } from '@ngx-formly/core';

import { AppInputFieldComponent } from './types/app-input-field/app-input-field.component';
import { AppPasswordFieldComponent } from './types/app-password-field/app-password-field.component';
import { AppOtpFieldComponent } from '@shared/ui/formly/types/app-otp-field/app-otp-field.component';
import { AppTextareaFieldComponent } from '@shared/ui/formly/types/app-textarea-field/app-textarea-field.component';
import { AppSelectFieldComponent } from '@shared/ui/formly/types/app-select-field/app-select-field.component';
import { AppAutocompleteFieldComponent } from '@shared/ui/formly/types/app-autocomplete-field/app-autocomplete-field.component';
import { AppOptionCardsFieldComponent } from '@shared/ui/formly/types/app-option-cards-field/app-option-cards-field.component';
import { AppColorOptionsFieldComponent } from '@shared/ui/formly/types/app-color-options-field/app-color-options-field.component';
import { AppFileUploadFieldComponent } from '@shared/ui/formly/types/app-file-upload-field/app-file-upload-field.component';

export const APP_FORMLY_CONFIG: ConfigOption = {
  types: [
    {
      name: 'app-input',
      component: AppInputFieldComponent,
    },
    {
      name: 'app-password',
      component: AppPasswordFieldComponent,
    },
    {
      name: 'app-otp',
      component: AppOtpFieldComponent,
    },
    {
      name: 'app-textarea',
      component: AppTextareaFieldComponent,
    },
    {
      name: 'app-select',
      component: AppSelectFieldComponent,
    },
    {
      name: 'app-autocomplete',
      component: AppAutocompleteFieldComponent,
    },
    {
      name: 'app-option-cards',
      component: AppOptionCardsFieldComponent,
    },
    {
      name: 'app-color-options',
      component: AppColorOptionsFieldComponent,
    },
    {
      name: 'app-file-upload',
      component: AppFileUploadFieldComponent,
    },
  ],
};
