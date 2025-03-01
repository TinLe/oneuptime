import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseModel from 'Common/Models/BaseModel';
import ColumnLength from 'Common/Types/Database/ColumnLength';
import ColumnType from 'Common/Types/Database/ColumnType';
import Project from './Project';
import ObjectID from 'Common/Types/ObjectID';
import Version from 'Common/Types/Version';
import SlugifyColumn from 'Common/Types/Database/SlugifyColumn';
import User from './User';
import TableColumn from 'Common/Types/Database/TableColumn';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/BaseDatabase/TableColumnType';
import TenantColumn from 'Common/Types/Database/TenantColumn';
import Permission from 'Common/Types/Permission';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import IsPermissionsIf from 'Common/Types/Database/IsPermissionsIf';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
import File from './File';

@IsPermissionsIf(Permission.Public, 'projectId', null)
@TenantColumn('projectId')
@CrudApiEndpoint(new Route('/probe'))
@SlugifyColumn('name', 'slug')
@Entity({
    name: 'Probe',
})
@TableMetadata({
    tableName: 'Probe',
    singularName: 'Probe',
    pluralName: 'Probes',
    icon: IconProp.Settings,
    tableDescription:
        'Manages custom probes. Deploy probes anywhere in the world and connect it to your project.',
})
@TableAccessControl({
    create: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanCreateProjectProbe,
    ],
    read: [Permission.Public],
    delete: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanDeleteProjectProbe,
    ],
    update: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanEditProjectProbe,
    ],
})
export default class Probe extends BaseModel {
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectProbe,
        ],
        read: [Permission.ProjectOwner, Permission.ProjectAdmin],
        update: [],
    })
    @TableColumn({
        required: true,
        unique: true,
        type: TableColumnType.ShortText,
    })
    @Column({
        type: ColumnType.ShortText,
        nullable: false,
        unique: true,
    })
    public key?: string = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectProbe,
        ],
        read: [Permission.Public],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectProbe,
        ],
    })
    @TableColumn({
        required: true,
        type: TableColumnType.Name,
        canReadOnRelationQuery: true,
    })
    @Column({
        nullable: false,
        type: ColumnType.Name,
        length: ColumnLength.Name,
    })
    public name?: string = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectProbe,
        ],
        read: [Permission.Public],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectProbe,
        ],
    })
    @TableColumn({ required: false, type: TableColumnType.Name })
    @Column({
        nullable: true,
        type: ColumnType.Name,
        length: ColumnLength.Name,
    })
    public description?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.Public],
        update: [],
    })
    @TableColumn({
        required: true,
        unique: true,
        type: TableColumnType.Slug,
        title: 'Slug',
        description: 'Friendly globally unique name for your object',
    })
    @Column({
        nullable: false,
        type: ColumnType.Slug,
        length: ColumnLength.Slug,
    })
    public slug?: string = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectProbe,
        ],
        read: [Permission.Public],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectProbe,
        ],
    })
    @TableColumn({ required: true, type: TableColumnType.Version })
    @Column({
        nullable: false,
        type: ColumnType.Version,
        length: ColumnLength.Version,
        transformer: Version.getDatabaseTransformer(),
    })
    public probeVersion?: Version = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectProbe,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectProbe,
        ],
        update: [],
    })
    @TableColumn({
        isDefaultValueColumn: false,
        required: false,
        type: TableColumnType.Date,
    })
    @Column({
        nullable: true,
        type: ColumnType.Date,
    })
    public lastAlive?: Date = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectStatusPage,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectStatusPage,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectStatusPage,
        ],
    })
    @TableColumn({
        manyToOneRelationColumn: 'iconFileId',
        type: TableColumnType.Entity,
        modelType: File,
        title: 'Icon',
        description: 'Probe Icon',
    })
    @ManyToOne(
        (_type: string) => {
            return File;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'delete',
        }
    )
    @JoinColumn({ name: 'iconFileId' })
    public iconFile?: File = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectStatusPage,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectStatusPage,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectStatusPage,
        ],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Icon',
        description: 'Probe Page Icon File ID',
        canReadOnRelationQuery: true,
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public iconFileId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectProbe,
        ],
        read: [Permission.Public],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.Entity,
        required: false,
        modelType: Project,
    })
    @ManyToOne(
        (_type: string) => {
            return Project;
        },
        {
            cascade: false,
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'projectId' })
    public project?: Project = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectProbe,
        ],
        read: [Permission.Public],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: false,
        canReadOnRelationQuery: true,
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.Entity, modelType: User })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            cascade: false,
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'deletedByUserId' })
    public deletedByUser?: User = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Deleted by User ID',
        description:
            'User ID who deleted this object (if this object was deleted by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public deletedByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectProbe,
        ],
        read: [Permission.ProjectOwner],
        update: [],
    })
    @TableColumn({ type: TableColumnType.Entity, modelType: User })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'createdByUserId' })
    public createdByUser?: User = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectProbe,
        ],
        read: [Permission.ProjectOwner],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Created by User ID',
        description:
            'User ID who created this object (if this object was created by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public createdByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],
        update: [],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        required: true,
        type: TableColumnType.Boolean,
    })
    @Column({
        type: ColumnType.Boolean,
        nullable: false,
        unique: false,
        default: false,
    })
    public isGlobalProbe?: boolean = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectStatusPage,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectStatusPage,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectStatusPage,
        ],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        required: true,
        type: TableColumnType.Boolean,
    })
    @Column({
        type: ColumnType.Boolean,
        nullable: false,
        unique: false,
        default: false,
    })
    public shouldAutoEnableProbeOnNewMonitors?: boolean = undefined;
}
