import { FC } from 'react';
import AppButton from '@ui/AppButton';
import { useFormikContext } from 'formik';

interface Props {
  title: string;
}

const SubmitBtn: FC<Props> = props => {
  const { handleSubmit } = useFormikContext();

  return <AppButton title={props.title} onPress={handleSubmit} />;
};

export default SubmitBtn;
