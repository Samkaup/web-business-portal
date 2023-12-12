import { TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button/Button';
import ModalSimpleWithDismiss from '@/components/ui/ModalSimpleWithDismiss/ModalSimpleWithDismiss';
import { Props } from './DeleteItemButton.types';

export const DeleteItemButton = ({ table, id, verify, children }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorDeletingText, setErrorDeletingText] = useState('');

  const queryClient = useQueryClient();

  const deleteItem = async (id: string) => {
    setLoading(true);
    let successful = false;
    fetch(`/api/delete?table=${table}&id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status == 200) {
          successful = true;
        }
        return res.json();
      })
      .then((response) => {
        if (successful) {
          queryClient.invalidateQueries([`${table}`]);
          setErrorDeletingText('');
          setShowModal(false);
        } else {
          setErrorDeletingText(JSON.stringify(response));
        }
      })
      .catch((e) => {
        setErrorDeletingText(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const verifyAction = async () => {
    if (verify && id && table) {
      setShowModal(true);
    } else {
      deleteItem(id);
    }
  };
  return (
    <span>
      <Button secondary onClick={verifyAction}>
        <TrashIcon className="w-4 h-4 text-red-700"></TrashIcon>
      </Button>
      <ModalSimpleWithDismiss
        open={showModal}
        onAction={() => deleteItem(id)}
        onCancel={() => setShowModal(false)}
        isLoading={loading}
        errorText={errorDeletingText}
      ></ModalSimpleWithDismiss>
      {children}
    </span>
  );
};
