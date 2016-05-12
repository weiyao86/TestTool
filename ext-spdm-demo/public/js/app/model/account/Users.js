﻿Ext.define('SPDM.model.account.Users', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'usercode', type: 'varchar', mapping: 'UserCode' },
        { name: 'username', type: 'varchar', mapping: 'UserName' },
        { name: 'rolename', type: 'varchar', mapping: 'RoleName' },
        { name: 'isvalidname', type: 'varchar', mapping: 'IsValid' },
        { name: 'lastlogindate', type: 'varchar', mapping: 'LastLoginData' },
        { name: 'createby', type: 'varchar', mapping: 'CreateBy' },
        { name: 'createdate', type: 'varchar', mapping: 'CreateDate' },
        { name: 'updateby', type: 'varchar', mapping: 'UpdateBy' },
        { name: 'updatedate', type: 'varchar', mapping: 'UpdateDate' }
    ]
});