'use client';
import { Context } from '@/utils/context-store';
import { useContext } from 'react';
import Select from '@/components/ui/Select';
import { useCompanies } from '@/utils/react_query_hooks/company';

export default function CompanySwitcher() {
  const { company, setCompany } = useContext(Context);
  const { data, isSuccess } = useCompanies();

  const updateCompany = (id: string) => {
    const selectedCompany = data.find(
      (c) => c.external_identifier.toString() === id
    );
    setCompany(selectedCompany);
  };

  return (
    <>
      {isSuccess && (
        <div className="mr-2">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            <div>
              <Select
                options={data.map((c) => ({
                  id: c.external_identifier,
                  label: `${c.name} - ${c.external_identifier}`,
                  key: c.external_identifier
                }))}
                value={
                  company
                    ? company.external_identifier
                    : data.at(0)?.external_identifier
                }
                onChange={(e) => updateCompany(e.target.value)}
              />
            </div>
          </h3>
        </div>
      )}
    </>
  );
}
