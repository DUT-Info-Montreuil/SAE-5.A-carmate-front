import { LicenseStatus, DocumentMetaDatas } from 'src/app/model/admin.model';
import { Document } from 'src/app/model/admin.model';

export class MutualizedMockData {
  static generalData: (Document & {
    status: LicenseStatus;
    published_at: Date;
  })[] = [
    {
      first_name: 'Chong',
      last_name: 'McTiesan',
      account_type: 'Student',
      license_type: 'Basic',
      document:
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY3growIAAycBLhVrvukAAAAASUVORK5CYII=',
      document_id: 1,
      status: 'Approved',
      published_at: new Date('11/11/2022'),
    },
    {
      first_name: 'Johny',
      last_name: 'Sins',
      account_type: 'Student',
      license_type: 'Driver',
      document:
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY3growIAAycBLhVrvukAAAAASUVORK5CYII=',
      document_id: 2,
      status: 'Pending',
      published_at: new Date('11/11/2022'),
    },
    {
      first_name: 'Kulanga',
      last_name: 'Biche',
      account_type: 'Teacher',
      license_type: 'Driver',
      document:
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY3growIAAycBLhVrvukAAAAASUVORK5CYII=',
      document_id: 3,
      status: 'Pending',
      published_at: new Date('11/11/2022'),
    },
    {
      first_name: 'Mokangua',
      last_name: 'TéléGama',
      account_type: 'Student',
      license_type: 'Driver',
      document:
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY3growIAAycBLhVrvukAAAAASUVORK5CYII=',
      document_id: 4,
      status: 'Rejected',
      published_at: new Date('11/11/2022'),
    },
  ];

  static initialized = false;

  static getAllOrCreate(): (Document & {
    status: LicenseStatus;
    published_at: Date;
  })[] {
    if (!MutualizedMockData.initialized) {
      MutualizedMockData.initialized = true;
      MutualizedMockData.initializeDocuments();
    }
    return MutualizedMockData.generalData;
  }

  static getRecapOrCreate(): DocumentMetaDatas[] {
    if (!MutualizedMockData.initialized) {
      MutualizedMockData.initialized = true;
      MutualizedMockData.initializeDocuments();
    }
    return MutualizedMockData.generalData
      .filter((doc) => doc.status === 'Pending')
      .map((doc) => {
        return {
          first_name: doc.first_name,
          last_name: doc.last_name,
          account_type: doc.account_type,
          published_at: doc.published_at,
          license_type: doc.license_type,
          document_id: doc.document_id,
        };
      }) as DocumentMetaDatas[];
  }

  static getDocumentsForValidationOrCreate(): Document[] {
    if (!MutualizedMockData.initialized) {
      MutualizedMockData.initialized = true;
      MutualizedMockData.initializeDocuments();
    }
    return MutualizedMockData.generalData.map((doc) => {
      return {
        first_name: doc.first_name,
        last_name: doc.last_name,
        account_type: doc.account_type,
        license_type: doc.license_type,
        document: doc.document,
        document_id: doc.document_id,
        status: doc.status,
      };
    }) as Document[];
  }

  static initializeDocuments() {
    let licenseStatus: LicenseStatus | null = null;
    for (let i = 5; i < 100; i++) {
      const rand_status = Math.random();

      if (rand_status < 0.33) {
        licenseStatus = 'Pending';
      } else if (rand_status < 0.66) {
        licenseStatus = 'Approved';
      } else {
        licenseStatus = 'Rejected';
      }

      MutualizedMockData.generalData.push({
        first_name: `FirstName${i}`,
        last_name: `LastName${i}`,
        account_type: i % 2 === 0 ? 'Student' : 'Teacher',
        license_type: i % 2 === 0 ? 'Basic' : 'Driver',
        document:
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY3growIAAycBLhVrvukAAAAASUVORK5CYII',
        document_id: i,
        status: licenseStatus,
        published_at: new Date('11/11/2022'),
      });
    }
  }
}
