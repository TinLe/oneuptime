import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateStatusPageLayout } from '../../actions/statusPage';
import ShouldRender from '../basic/ShouldRender';
import PropTypes from 'prop-types';
import { FormLoader } from '../basic/Loader';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 5,
    margin: `0 0 ${grid}px 0`,
    borderRadius: '5px',
    background: isDragging ? 'lightgreen' : 'black',
    ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'transparent',
    padding: grid,
    width: '30rem',
    color: '#fff',
    height: '90%',
});
export class StatusPageLayout extends Component {
    state = {
        visible: [
            { name: 'Resources Status', id: 12, key: 'resources' },
            { name: 'Services Status', id: 13, key: 'services' },
            { name: 'Past Incidents', id: 15, key: 'pastIncidents' },
            { name: 'Scheduled Maintenance', id: 18, key: 'maintenance' },
        ],
        invisible: [],
    };

    componentDidMount() {
        const { statusPage } = this.props;
        const { layout } = statusPage.status;
        const visible = (layout && layout.visible) || [];
        const invisible = (layout && layout.invisible) || [];

        if (visible.length > 0 || invisible.length > 0) {
            this.setState({
                visible,
                invisible,
            });
        }
    }
    handleSubmit = () => {
        const layout = {
            visible: this.state.visible,
            invisible: this.state.invisible,
        };
        const { statusPage } = this.props;
        const { _id, projectId } = statusPage.status;
        this.props.updateStatusPageLayout(projectId._id, {
            _id,
            projectId,
            layout,
        });
    };

    onDragEnd = result => {
        // dropped outside the list
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = source.droppableId;
        const finish = destination.droppableId;

        if (start === finish) {
            const result = Array.from(this.state[start]);
            const [removed] = result.splice(source.index, 1);
            result.splice(destination.index, 0, removed);

            this.setState({
                [start]: result,
            });
            return;
        }

        // Moving from one list to another
        const startTask = Array.from(this.state[start]);
        const [removed] = startTask.splice(source.index, 1);

        const finishTask = Array.from(this.state[finish]);
        finishTask.splice(destination.index, 0, removed);

        this.setState({
            [start]: startTask,
            [finish]: finishTask,
        });
    };

    render() {
        return (
            <div className="bs-ContentSection Card-root Card-shadow--medium">
                <div className="Box-root">
                    <div className="ContentHeader Box-root Box-background--white Box-divider--surface-bottom-1 Flex-flex Flex-direction--column Padding-horizontal--20 Padding-vertical--16">
                        <div className="Box-root Flex-flex Flex-direction--row Flex-justifyContent--spaceBetween">
                            <div className="ContentHeader-center Box-root Flex-flex Flex-direction--column Flex-justifyContent--center">
                                <span className="ContentHeader-title Text-color--inherit Text-display--inline Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--28 Text-typeface--base Text-wrap--wrap">
                                    <span
                                        style={{ textTransform: 'capitalize' }}
                                    >
                                        Status Page Layout
                                    </span>
                                </span>
                                <span className="ContentHeader-description Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                    <span>
                                        Order Status page Layout by dragging
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="bs-ContentSection-content Box-root Box-divider--surface-bottom-1"
                        style={{ overflow: 'hidden', overflowX: 'auto' }}
                    >
                        <div>
                            <div
                                className="bs-Fieldset-wrapper Box-root"
                                style={{
                                    background: '#f7f7f7',
                                }}
                            >
                                <DragDropContext onDragEnd={this.onDragEnd}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginBottom: '36px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                marginRight: '20px',
                                                boxShadow:
                                                    ' 0 7px 14px 0 rgb(50 50 93 / 10%), 0 3px 6px 0 rgb(0 0 0 / 7%)',
                                                marginBottom: '20px',
                                                marginTop: '20px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: '12px 10px',
                                                    borderBottom:
                                                        '1px solid rgb(50 50 93 / 10%)',
                                                }}
                                                className="ContentHeader-title Text-color--inherit Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--28 Text-typeface--base Text-wrap--wrap"
                                            >
                                                VISIBLE{' '}
                                                <span className="ContentHeader-description Text-color--inherit Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                                    (Items in this column ill be
                                                    visible on status page)
                                                </span>
                                            </div>

                                            <Droppable droppableId="visible">
                                                {(provided, snapshot) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={getListStyle(
                                                            snapshot.isDraggingOver
                                                        )}
                                                    >
                                                        <div
                                                            style={getItemStyle(
                                                                false,
                                                                false
                                                            )}
                                                        >
                                                            Header
                                                        </div>
                                                        {this.state.visible.map(
                                                            (item, index) => (
                                                                <Draggable
                                                                    key={
                                                                        item.name +
                                                                        item.id
                                                                    }
                                                                    draggableId={
                                                                        item.name +
                                                                        item.id
                                                                    }
                                                                    index={
                                                                        index
                                                                    }
                                                                >
                                                                    {(
                                                                        provided,
                                                                        snapshot
                                                                    ) => (
                                                                        <div
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={getItemStyle(
                                                                                snapshot.isDragging,
                                                                                provided
                                                                                    .draggableProps
                                                                                    .style,
                                                                                item.color
                                                                            )}
                                                                        >
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            )
                                                        )}
                                                        {provided.placeholder}
                                                        <div
                                                            style={getItemStyle(
                                                                false,
                                                                false
                                                            )}
                                                        >
                                                            Footer
                                                        </div>
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                        <div
                                            style={{
                                                boxShadow:
                                                    ' 0 7px 14px 0 rgb(50 50 93 / 10%), 0 3px 6px 0 rgb(0 0 0 / 7%)',
                                                marginBottom: '20px',
                                                marginTop: '20px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: '12px 10px',
                                                    borderBottom:
                                                        '1px solid rgb(50 50 93 / 10%)',
                                                }}
                                                className="ContentHeader-title Text-color--inherit Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--28 Text-typeface--base Text-wrap--wrap"
                                            >
                                                INVISIBLE{' '}
                                                <span className="ContentHeader-description Text-color--inherit Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                                    (Items in this column will
                                                    be hidden on status page)
                                                </span>
                                            </div>
                                            <Droppable droppableId="invisible">
                                                {(provided, snapshot) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={getListStyle(
                                                            snapshot.isDraggingOver,
                                                            true
                                                        )}
                                                    >
                                                        {this.state.invisible.map(
                                                            (item, index) => (
                                                                <Draggable
                                                                    key={
                                                                        item.name +
                                                                        item.id
                                                                    }
                                                                    draggableId={
                                                                        item.name +
                                                                        item.id
                                                                    }
                                                                    index={
                                                                        index
                                                                    }
                                                                >
                                                                    {(
                                                                        provided,
                                                                        snapshot
                                                                    ) => (
                                                                        <div
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={getItemStyle(
                                                                                snapshot.isDragging,
                                                                                provided
                                                                                    .draggableProps
                                                                                    .style,
                                                                                item.color
                                                                            )}
                                                                        >
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            )
                                                        )}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    </div>
                                </DragDropContext>
                                <div className="bs-ContentSection-footer bs-ContentSection-content Box-root Box-background--white Flex-flex Flex-alignItems--center Flex-justifyContent--flexEnd Padding-horizontal--20 Padding-vertical--12">
                                    <div>
                                        <button
                                            className="bs-Button bs-DeprecatedButton bs-Button--blue"
                                            disabled={
                                                this.props.statusPage.customHTML
                                                    .requesting
                                            }
                                            onClick={this.handleSubmit}
                                            id="btnAddCustomStyles"
                                        >
                                            <ShouldRender if={true}>
                                                <span>Save</span>
                                            </ShouldRender>
                                            <ShouldRender if={false}>
                                                <FormLoader />
                                            </ShouldRender>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

StatusPageLayout.displayName = 'Custom Styles';

StatusPageLayout.propTypes = {
    statusPage: PropTypes.object.isRequired,
    updateStatusPageLayout: PropTypes.func,
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            updateStatusPageLayout,
        },
        dispatch
    );

const mapStateToProps = ({ statusPage }) => {
    const { headerHTML, footerHTML, customCSS, customJS } = statusPage.status;
    return {
        initialValues: {
            headerHTML,
            footerHTML,
            customCSS,
            customJS,
        },
        statusPage,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusPageLayout);
