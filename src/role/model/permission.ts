export enum PermissionBusiness {
  CREATE_PROJECT = 'CREATE_PROJECT',
}

export enum PermissionProject {
  UPDATE_INFORMATION = 'UPDATE_INFORMATION',
}

export const PermissionTitlesBusiness = {
  [PermissionBusiness.CREATE_PROJECT]: 'Projekte erstellen',
};

export const PermissionTitlesProject = {
  [PermissionProject.UPDATE_INFORMATION]: 'Informationen aktualisieren',
};
