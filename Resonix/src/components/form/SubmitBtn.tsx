import { FC } from 'react';
import AppButton from '@ui/AppButton';
import { useFormikContext } from 'formik';

interface Props {
  title: string;
  disabled?: boolean;
}

const SubmitBtn: FC<Props> = props => {
  const { handleSubmit, isValid, dirty, isSubmitting } = useFormikContext();

  const isDisabled = props.disabled ?? !(isValid && dirty);

  return (
    <AppButton
      title={props.title}
      onPress={handleSubmit}
      disabled={isDisabled}
      busy={isSubmitting}
    />
  );
};

export default SubmitBtn;
