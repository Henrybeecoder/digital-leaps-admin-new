import './certificate.css';
import vector1 from '../assets/certificate/Vector 13.png';
import vector2 from '../assets/certificate/Vector 15.png';
import vector3 from '../assets/certificate/Vector 14.png';
import { CertGroup, CertLeftWing, CertRIghtWing } from './Svg';
import qrCode from '../assets/certificate/vaadin_qrcode (1).svg';
import { CertificateType } from '../../types';
import QRCode from 'react-qr-code';
import { forwardRef } from 'react';
import { formatDate } from '../utils/helper';
import logo from '../assets/Logo-96efc483.svg';

const Certificate = forwardRef(
  (
    { details }: { details: CertificateType },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const {
      courseName,
      instructor1,
      instructor2,
      studentName,
      text,
      id,
      dateGenerated,
    } = details;

    return (
      <div className='cert-container' ref={ref}>
        <img className='cert-vector-1' src={vector1} />
        <img className='cert-vector-2' src={vector2} />
        <img className='cert-vector-3' src={vector3} />

        <div className='cert-content'>
          <section>
            <div className=''>
              <CertGroup />
              <div className=''>
                <CertLeftWing />
                <CertRIghtWing />
              </div>
            </div>
            {id ? (
              <div className='img'>
                <QRCode
                  value={`https://digitalleaps-fdef4.web.app/certificate/${id}`}
                  size={256}
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  viewBox={`0 0 256 256`}
                />
              </div>
            ) : (
              <div className='img' style={{ visibility: 'hidden' }}>
                <img alt='cert-qr-code' src={qrCode} />
              </div>
            )}
          </section>
          <div className='cert-blue-divider' />
          <div className='cert-main-content'>
            <img className='' alt='logo' src={logo} />
            <h2>CERTIFICATE</h2>
            <h4>OF COMPLETION</h4>

            {/* <h3>{courseName}</h3> */}
            <h5>This certificate is presented to</h5>

            <h1>{studentName}</h1>
            <p className='cert-text'>
              {' '}
              For her/his completion and participation in {courseName}
            </p>

            <div className='cert-signature-container'>
              <div className=''>
                <h6>{instructor1}</h6>
                <div />
                <p>Instructor Name</p>
              </div>

              {instructor2 && (
                <div className=''>
                  {instructor2 && <h6>{instructor2}</h6>}
                  {instructor2 && <div />}
                  {instructor2 && <p>Instructor Name</p>}
                </div>
              )}
            </div>
            <p className='full-date'>{formatDate(dateGenerated.toDate())}</p>
          </div>
        </div>
      </div>
    );
  }
);

export default Certificate;
