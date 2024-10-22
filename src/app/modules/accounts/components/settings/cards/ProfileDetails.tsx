import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import { IProfileDetails, profileDetailsInitValues as initialValues } from '../SettingsModel';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAuth } from '../../../../auth';

const ProfileDetails: React.FC = () => {
  const { currentUser } = useAuth(); // Auth context to get current user

  const [data, setData] = useState<IProfileDetails>({
    ...initialValues,
    fName: currentUser?.first_name || '',
    lName: currentUser?.last_name || '',
    company: '',         // Ajoutez d'autres champs nécessaires avec des valeurs par défaut
    contactPhone: '',
    companySite: '',
    avatar: '',          // Assurez-vous d'avoir une valeur par défaut pour l'avatar
  });

  const updateData = (fieldsToUpdate: Partial<IProfileDetails>): void => {
    const updatedData = { ...data, ...fieldsToUpdate }; // Spread operator to merge updated fields
    setData(updatedData);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formik = useFormik<IProfileDetails>({
    initialValues: data,
    enableReinitialize: true,  // Permet à formik de mettre à jour ses valeurs initiales lorsque `data` change

    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        if (!currentUser) {
          setError('User is not authenticated.');
          setLoading(false);
          return;
        }

        const response = await axios.put(
          `http://localhost:3001/user/update/${currentUser.first_name}`,
          {
            first_name: values.fName,
            last_name: values.lName,
          }
        );

        setSuccess('Profile updated successfully!');
        setData(response.data.user); 
      } catch (err) {
        console.error('Error updating profile:', err);
        setError('Failed to update profile. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  // Garder les valeurs de formik synchronisées avec l'état data
  useEffect(() => {
    if (data) {
      formik.setValues(data);
    }
  }, [data]);

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Profile Details</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9'>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

           

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Full Name</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='First name'
                      {...formik.getFieldProps('fName')}
                    />
                    {formik.touched.fName && formik.errors.fName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.fName}</div>
                      </div>
                    )}
                  </div>

                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Last name'
                      {...formik.getFieldProps('lName')}
                    />
                    {formik.touched.lName && formik.errors.lName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.lName}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Company</label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Company name'
                  {...formik.getFieldProps('company')}
                />
                {formik.touched.company && formik.errors.company && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.company}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>Contact Phone</span>
              </label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='tel'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Phone number'
                  {...formik.getFieldProps('contactPhone')}
                />
                {formik.touched.contactPhone && formik.errors.contactPhone && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.contactPhone}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>Company Site</span>
              </label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Company website'
                  {...formik.getFieldProps('companySite')}
                />
                {formik.touched.companySite && formik.errors.companySite && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.companySite}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {loading && (
                <span className='indicator-progress' style={{ display: 'block' }}>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
              <span className='indicator-label'>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { ProfileDetails };
