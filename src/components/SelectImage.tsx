import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import uploadIcon from '../assets/icons/material-symbols_upload.svg';
import './index.css';

interface Props {
  control: any;
  name?: string;
  label: string;
  required?: boolean;
}

const SelectImage = ({ control, name, label: labelText, required }: Props) => {
  const imageRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      control={control}
      name={name || 'cover'}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className='form-image-select'>
          <input
            hidden
            type='file'
            ref={imageRef}
            accept='image/jpeg, image/png, image/webp'
            onChange={(e) => {
              const file = e.target?.files?.[0];
              if (!file) return;
              value?.previewUrl && URL.revokeObjectURL(value.previewUrl);
              onChange({ previewUrl: URL.createObjectURL(file), file });
            }}
          />
          <label>
            {labelText} {required && <span>*</span>}{' '}
          </label>
          {value?.previewUrl || value?.serverUrl ? (
            <div className='upload-image-preview'>
              <img alt='preview' src={value?.previewUrl || value?.serverUrl} />
              <button type='button' onClick={() => imageRef.current?.click()}>
                Change
              </button>
            </div>
          ) : (
            <div className='upload-image-group'>
              <button
                type='button'
                onClick={() => imageRef.current?.click()}
                style={{ border: error ? '1px solid red' : '' }}>
                Upload image
                <span>
                  <img alt='upload-icon' src={uploadIcon} />
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default SelectImage;
