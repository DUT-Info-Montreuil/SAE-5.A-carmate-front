export type LicenceType = 'Basic' | 'Driver';
export type AccountType = 'Student' | 'Teacher';
export type LicenseStatus = 'Pending' | 'Approved' | 'Rejected';
export type DocumentMetaDatas = {
  first_name: string;
  last_name: string;
  account_type: AccountType;
  published_at: Date;
  license_type: LicenceType;
  document_id: number;
};

export type PaginatedDocMetaDatas = {
  items: DocumentMetaDatas[];
  nb_documents: number;
};

export type Document = {
  first_name: string;
  last_name: string;
  account_type: AccountType;
  license_type: LicenceType;
  document: string;
  document_id: number;
};

export type NextDocument = {
  next_document_id: number;
};
