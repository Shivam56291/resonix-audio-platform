import { FC } from 'react';
import { Button } from 'react-native';
import { useFormikContext } from 'formik';

interface Props {
  title: string;
}

const SubmitBtn: FC<Props> = props => {
  const { handleSubmit } = useFormikContext();

  return <Button title={props.title} onPress={handleSubmit} />;
};

export default SubmitBtn;
