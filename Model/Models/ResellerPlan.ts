import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import User from './User';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/BaseDatabase/TableColumnType';
import TableColumn from 'Common/Types/Database/TableColumn';
import ColumnType from 'Common/Types/Database/ColumnType';
import ObjectID from 'Common/Types/ObjectID';
import ColumnLength from 'Common/Types/Database/ColumnLength';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
import BaseModel from 'Common/Models/BaseModel';
import Reseller from './Reseller';


@TableAccessControl({
    create: [

    ],
    read: [

    ],
    delete: [

    ],
    update: [

    ],
})
@CrudApiEndpoint(new Route('/reseller-plan'))
@TableMetadata({
    tableName: 'Reseller Plan',
    singularName: 'Reseller Plan',
    pluralName: 'Reseller Plans',
    icon: IconProp.Billing,
    tableDescription:
        'List of Reseller Plans that reseller use to sell OneUptime.',
})
@Entity({
    name: 'ResellerPlan',
})
export default class ResellerPlan extends BaseModel {

    @ColumnAccessControl({
        create: [

        ],
        read: [

        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'resellerId',
        type: TableColumnType.Entity,
        modelType: Reseller,
        title: 'Reseller',
        description:
            'Relation to Reseller Resource in which this object belongs',
    })
    @ManyToOne(
        (_type: string) => {
            return Reseller;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'resellerId' })
    public project?: Reseller = undefined;

    @ColumnAccessControl({
        create: [

        ],
        read: [

        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'Reseller ID',
        description:
            'ID of your OneUptime Reseller in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public resellerId?: ObjectID = undefined;


    @ColumnAccessControl({
        create: [

        ],
        read: [

        ],
        update: [],
    })
    @TableColumn({
        required: true,
        type: TableColumnType.ShortText,
        canReadOnRelationQuery: true,
        title: 'Plan ID',
        description: 'ID of the plan. This is shared by the Reseller and OneUptime.',
    })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
    })
    public planId?: string = undefined;


    @ColumnAccessControl({
        create: [

        ],
        read: [

        ],
        update: [],
    })
    @TableColumn({
        required: true,
        type: TableColumnType.ShortText,
        canReadOnRelationQuery: true,
        title: 'Name',
        description: 'Name of the Reseller Plan',
    })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
    })
    public name?: string = undefined;


    @ColumnAccessControl({
        create: [

        ],
        read: [

        ],
        update: [],
    })
    @TableColumn({
        required: true,
        type: TableColumnType.ShortText,
        canReadOnRelationQuery: true,
        title: 'Description',
        description: 'Description of the Reseller Plan',
    })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
    })
    public description?: string = undefined;


    @ColumnAccessControl({
        create: [

        ],
        read: [

        ],
        update: [],
    })
    @TableColumn({
        required: false,
        type: TableColumnType.Number,
        canReadOnRelationQuery: true,
        title: 'Monitor Limit',
        description: 'Monitor Limit of the OneUptime Project.',
    })
    @Column({
        nullable: true,
        type: ColumnType.Number,
    })
    public monitorLimit?: number = undefined;


    @ColumnAccessControl({
        create: [

        ],
        read: [

        ],
        update: [],
    })
    @TableColumn({
        required: false,
        type: TableColumnType.Number,
        canReadOnRelationQuery: true,
        title: 'Team Member Limit',
        description: 'Team Member Limit of the OneUptime Project.',
    })
    @Column({
        nullable: true,
        type: ColumnType.Number,
    })
    public teamMemberLimit?: number = undefined;



    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanCreateProjectLabel,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectLabel,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'createdByUserId',
        type: TableColumnType.Entity,
        modelType: User,
        title: 'Created by User',
        description:
            'Relation to User who created this object (if this object was created by a User)',
    })
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
            Permission.CanCreateProjectLabel,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectLabel,
        ],
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
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectLabel,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'deletedByUserId',
        type: TableColumnType.Entity,
        title: 'Deleted by User',
        description:
            'Relation to User who deleted this object (if this object was deleted by a User)',
    })
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
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectLabel,
        ],
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


}
