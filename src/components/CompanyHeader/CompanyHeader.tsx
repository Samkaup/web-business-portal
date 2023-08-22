'use client';
import { TableRow } from '@/types';
import { Context } from '@/utils/context-store';
import { useContext, useEffect } from 'react';
import Select from '../ui/Select';
type Props = {
  companies?: TableRow<'company'>[];
};

export default function CompanyHeader({ companies = [] }: Props) {
  const { company, setCompany } = useContext(Context);

  const updateCompany = (id: string) => {
    const selectedCompany = companies.find(
      (c) => c.external_identifier.toString() === id
    );
    setCompany(selectedCompany);
  };

  useEffect(() => console.log(company), [company]);

  return (
    <>
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          <div>
            <Select
              options={companies.map((c) => ({
                id: c.external_identifier,
                label: c.name,
              }))}
              defaultValue={companies.at(0).external_identifier}
              onChange={(e) => updateCompany(e.target.value)}
            />
          </div>
        </h3>
        <div className="mt-3 flex sm:ml-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center btn-outline rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Stillingar fyrirtækis
          </button>
          {/* <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-company px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-company-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-company-900"
          >
            Velja annað fyrirtæki
          </button> */}
        </div>
      </div>
    </>
  );
}
