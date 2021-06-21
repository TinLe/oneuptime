import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Fade from 'react-reveal/Fade';
import Dashboard from '../components/Dashboard';
import ShouldRender from '../components/basic/ShouldRender';
import { LoadingState } from '../components/basic/Loader';
import PropTypes from 'prop-types';
import BreadCrumbItem from '../components/breadCrumb/BreadCrumbItem';
import { fetchAutomatedScript } from '../actions/automatedScript';
import NewScript from '../components/automationScript/NewScript';
import AutomatedTabularList from '../components/automationScript/AutomatedTabularList';

class AutomationScript extends Component {
    componentDidMount() {
        const projectId = this.props.currentProject
            ? this.props.currentProject._id
            : null;
        if (projectId) {
            this.props.fetchAutomatedScript(projectId, 0, 10);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentProject !== this.props.currentProject) {
            const projectId = this.props.currentProject._id;
            this.props.fetchAutomatedScript(projectId, 0, 10);
        }
    }

    render() {
        const {
            location: { pathname },
        } = this.props;

        return (
            <Dashboard>
                <Fade>
                    <BreadCrumbItem
                        route={pathname}
                        name="Automation Scripts"
                    />
                    <AutomatedTabularList {...this.props} />
                    <div className="Box-root">
                        <div>
                            <div>
                                <div className="db-BackboneViewContainer">
                                    <div className="dashboard-home-view react-view">
                                        <div>
                                            <div>
                                                <span>
                                                    <ShouldRender if={true}>
                                                        <NewScript />
                                                    </ShouldRender>

                                                    <ShouldRender if={false}>
                                                        <LoadingState />
                                                    </ShouldRender>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Dashboard>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            fetchAutomatedScript,
        },
        dispatch
    );
};

const mapStateToProps = state => {
    return {
        currentProject: state.project.currentProject,
    };
};

AutomationScript.propTypes = {
    projectId: PropTypes.string,
    fetchAutomatedScript: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string,
    }),
    currentProject: PropTypes.object,
};

AutomationScript.displayName = 'AutomationScript';

export default connect(mapStateToProps, mapDispatchToProps)(AutomationScript);