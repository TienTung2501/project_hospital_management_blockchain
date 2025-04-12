'use client';

import { useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import convertIpfsAddressToUrl from '@/helpers/convertIpfsAddressToUrl';
import LucidContext from '@/contexts/components/LucidContext';
import { LucidContextType } from '@/types/LucidContextType';

const ShowPage = () => {
  const { cid } = useParams();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDecrypted, setIsDecrypted] = useState(false);

  useEffect(() => {
    const decrypted = localStorage.getItem('decryptedFileUrl');

    if (decrypted) {
      setFileUrl(decrypted);
      setIsDecrypted(true);
    } else if (cid) {
      // Nếu không có file giải mã thì fallback về file IPFS
      const ipfsUrl = convertIpfsAddressToUrl(`ipfs://${cid}`);
      setFileUrl(ipfsUrl);
      setIsDecrypted(false);
    }
  }, [cid]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        🔐 Nội dung hồ sơ
        
       
        {isDecrypted ?
        <div className="mt-4 p-4 bg-gray-600 text-white rounded pt-4">
        <span className='text-green-500'> Hồ sơ sau khi giải mã!!!</span>
        </div>
        :
        <div className="mt-4 p-4 bg-gray-600 text-white rounded pt-4">
        <span className='text-red-500'> Bạn chưa được cấp quyền!!!</span>
        </div>
        }
      </h1>

      {fileUrl ? (
        <div className="mt-6 relative w-full h-[80vh]">
          <iframe
            src={fileUrl}
            className="w-full h-full rounded-lg border shadow-md"
            title={isDecrypted ? 'PDF đã giải mã' : 'PDF đã mã hóa'}
          ></iframe>
        </div>
      ) : (
        <div className="text-center text-red-500">
          <p>Không thể tải file.</p>
        </div>
      )}
    </div>
  );
};

export default ShowPage;
