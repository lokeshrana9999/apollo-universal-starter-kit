import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { View, StyleSheet } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { isFormError, FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { translate } from '@gqlapp/i18n-client-react';

import { RenderField, Button, primary } from '@gqlapp/look-client-react-native';
import { placeholderColor, submit } from '@gqlapp/look-client-react-native/styles';
import { required, minLength, validate, match } from '@gqlapp/validation-common-react';
import settings from '../../../../settings';

const resetPasswordFormSchema = {
  password: [required, minLength(settings.user.auth.password.minLength)],
  passwordConfirmation: [match('password'), required, minLength(settings.user.auth.password.minLength)]
};

const ResetPasswordForm = ({ values, handleSubmit, t }) => {
  return (
    <View style={styles.formContainer}>
      <Field
        name="password"
        component={RenderField}
        type="password"
        label={t('resetPass.form.field.pass')}
        value={values.password}
        secureTextEntry={true}
        placeholderTextColor={placeholderColor}
      />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label={t('resetPass.form.field.passConf')}
        value={values.passwordConfirmation}
        secureTextEntry={true}
        placeholderTextColor={placeholderColor}
      />
      <View style={styles.submit}>
        <Button type={primary} onPress={handleSubmit}>
          {t('resetPass.form.btnSubmit')}
        </Button>
      </View>
      <KeyboardSpacer />
    </View>
  );
};

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  t: PropTypes.func,
  values: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool
};

const ResetPasswordFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ password: '', passwordConfirmation: '' }),
  async handleSubmit(
    values,
    {
      setErrors,
      resetForm,
      props: { onSubmit }
    }
  ) {
    await onSubmit(values)
      .then(() => resetForm())
      .catch(e => {
        if (isFormError(e)) {
          setErrors(e.errors);
        } else {
          throw e;
        }
      });
  },
  validate: values => validate(values, resetPasswordFormSchema),
  displayName: 'LoginForm' // helps with React DevTools
});

const styles = StyleSheet.create({
  submit,
  formContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center'
  }
});

export default translate('user')(ResetPasswordFormWithFormik(ResetPasswordForm));
