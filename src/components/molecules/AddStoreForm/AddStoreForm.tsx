import React from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import { Formik } from 'formik';
import { storeType } from '../../../types/types';
import { db } from '../../../firebase/firebaseConfig';
import { StoreType } from '../../../classes/classes';
import { baseBranches } from '../../../firebase/firebaseEndpoints';
import MenuHeader from '../../atoms/MenuHeader/MenuHeader';
import MenuButton from '../../atoms/MenuButton/MenuButton';
import FormInput from '../FormInput/FormInput';

const StyledForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledInputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 0;
`;

const StyledButtonsWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 0 15px;
  justify-content: space-around;
`;

interface Props {
  toggleModal: Function;
  availableStores: storeType[];
}

const AddStoreForm = (props: Props) => {
  const { toggleModal, availableStores } = props;
  const initialValues: storeType = { name: '', identifier: '' };

  const getProperties = (propName: string, stores: storeType[]): string[] => {
    const properties: string[] = [];
    stores.map((store) => {
      properties.push(store[propName]);
      return undefined;
    });
    return properties;
  };
  const usedNames = getProperties('name', availableStores);
  const usedIdentifiers = getProperties('identifier', availableStores);
  let validateSchema = yup.object().shape({
    name: yup.string().required('Pole jest wymagane').notOneOf(usedNames, 'Nazwa już istnieje'),

    identifier: yup
      .string()
      .length(3, 'Typ musi zawierać 3 litery')
      .required('Pole jest wymagane')
      .uppercase()
      .notOneOf(usedIdentifiers, 'Typ już istnieje: '),
  });

  const createNewStore = (values: storeType) => {
    const { name, identifier } = values;
    const newStore = new StoreType(name, identifier);
    const updates = {};
    updates[`${baseBranches.storesBranch}${identifier}`] = 'EMPTY';
    updates[`${baseBranches.storeTypeBranch}${identifier}`] = newStore;
    db.ref('QR').update(updates);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validateSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        createNewStore(values);
        toggleModal();
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, touched, errors, values, resetForm, setSubmitting }) => (
        <StyledForm onSubmit={handleSubmit} autoComplete={'off'}>
          <MenuHeader>Nowy Magazyn</MenuHeader>
          <StyledInputsWrapper>
            <FormInput
              name={'name'}
              type={'text'}
              label={'Nazwa'}
              maxLength={25}
              error={errors.name && touched.name ? true : false}
              errorText={errors.name && touched.name ? errors.name : ''}
            />

            <FormInput
              name={'identifier'}
              type={'text'}
              label={'Etykieta'}
              maxLength={3}
              error={errors.identifier && touched.identifier ? true : false}
              errorText={errors.identifier && touched.identifier ? errors.identifier : ''}
            />
          </StyledInputsWrapper>
          <StyledButtonsWrapper>
            <MenuButton type={'submit'}>Dodaj nowy</MenuButton>
            <MenuButton
              onClick={() => {
                toggleModal();
                setSubmitting(false);
                resetForm();
              }}
            >
              Anuluj
            </MenuButton>
          </StyledButtonsWrapper>
        </StyledForm>
      )}
    </Formik>
  );
};

export default AddStoreForm;
