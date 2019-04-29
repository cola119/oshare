import React from 'react';
import { firebaseDB } from '../../firebase';
import { withRouter } from 'react-router'
import CirclesAndPaths from '../svg/CirclesAndPaths';
import SVGViewArea from '../svg/SVGViewArea';

import PathsList from '../molecules/RadioList';
import RoutesList from '../molecules/CheckboxList';
import withWidth from '@material-ui/core/withWidth';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import MySlider from '../atoms/MySlider';
import RotateButtons from '../molecules/RotateButtons';
import NormalButton from '../atoms/Buttons/NormalButton';

class ShowCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rotate: 0,
            selectedPathId: null,
            selectedRouteId: null,
            selectedRouteIds: [],
            selectedPath: [],
            showRoutes: [],
            selectedCircles: [],
            selectedCirclesOfRoute: [],
            selectedPointsOfRoute: [],
            selectedRouteColor: "#9400D3",
            imageOpacity: 1,
            isShowUtiliys: true,
        };
    }

    componentDidMount() {
        this.props.loadCourse(this.props.match.params.id)
        this.props.loadPublicRoutes();
    }

    handleClick = () => {
        this.props.history.push({
            pathname: `/show/${this.props.match.params.id}/route`,
            state: { courseInfo: this.courseInfo, }
        });
    }

    selectPath = (e, pathId) => {
        this.setState({ selectedPathId: pathId, selectedRouteIds: [], imageOpacity: 0.7 });
        const selectedPath = this.courseInfo.paths.find(path => path.id === pathId)
        const selectedCircles = selectedPath.points.map(p => this.courseInfo.circles.find(c => c.id === p))
        this.setState({ selectedPath: [selectedPath], selectedCircles: selectedCircles, selectedPointsOfRoute: [] });
        this.setState({ showRoutes: this.courseInfo.haveRoutes.filter(route => route.pathId === pathId) })
    }

    selectRoute = (e, route) => {
        const currentIds = this.state.selectedRouteIds
        const newIds = (currentIds.includes(route.id)) ? currentIds.filter(id => id !== route.id) : [...currentIds, route.id]
        this.setState({ selectedRouteIds: newIds });
        this.setShowCircles(newIds)
    }

    setShowCircles = (newIds) => {
        const selectedRoutes = this.courseInfo.haveRoutes.filter(route => newIds.includes(route.id))
        const selectedCirclesOfRoute = [...selectedRoutes.map(route => route.points).flat(), ...this.state.selectedCircles]
        const from = this.state.selectedCircles[0];
        const to = this.state.selectedCircles[this.state.selectedCircles.length - 1];
        const selectedPointsOfRoute = selectedRoutes.map(route => ({ points: [from.id, ...route.points.map(val => val.id), to.id], pathColor: route.pathColor }))
        this.setState({ selectedCirclesOfRoute: selectedCirclesOfRoute })
        this.setState({ selectedPointsOfRoute: selectedPointsOfRoute })
    }

    deleteRoute = (key) => {
        firebaseDB.collection("routes").doc(key).delete().then(() => console.log("deleted"));
    }

    render() {
        const utilStyle = {
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            display: 'flex',
            zIndex: 1,
            top: "0px",
            left: "0px",
            backgroundColor: "rgba(255,255,255,0.7)",
            paddingLeft: "10px",
            width: "60vw"
        }
        this.courseInfo = this.props.myCourses
        if (this.props.isLoading || this.courseInfo.imageSize === undefined) return <div>loading</div>;
        return (
            <Grid container spacing={0}>
                <Grid item xs={12} sm={8}>
                    <div style={{ height: (this.props.width === 'xs') ? "60vh" : "90vh" }}>
                        {this.state.isShowUtiliys &&
                            <div style={utilStyle}>
                                <MySlider
                                    value={this.state.rotate}
                                    onChange={(_, value) => this.setState({ rotate: value })}
                                    min={0} max={360}
                                />
                                <RotateButtons
                                    onClick={(angle) => this.setState(state => ({ rotate: state.rotate + 5 * angle }))}
                                />
                            </div>
                        }
                        <SVGViewArea
                            // Viewer={this.Viewer}
                            rotate={this.state.rotate}
                            clickEvent={() => (null)}
                            width={this.courseInfo.imageSize.width}
                            height={this.courseInfo.imageSize.height}
                            imageUrl={this.courseInfo.imageUrl}
                            imageOpacity={this.state.imageOpacity}
                            notShowUtiliys={true}
                        >
                            <CirclesAndPaths
                                circles={this.state.selectedCircles}
                                paths={this.state.selectedPath}
                                r={this.courseInfo.circleStyle.r}
                                strokeWidth={this.courseInfo.circleStyle.strokeWidth}
                                circleOpacity={this.courseInfo.circleStyle.opacity}
                                pathOpacity={this.courseInfo.circleStyle.opacity}
                                event={{}} />
                            {this.state.selectedCirclesOfRoute.length > 0 &&
                                <CirclesAndPaths
                                    circles={this.state.selectedCirclesOfRoute}
                                    paths={this.state.selectedPointsOfRoute}
                                    r={0}
                                    pathColor={this.courseInfo.pathColor}
                                    strokeWidth={3}
                                    circleOpacity={0.2}
                                    pathOpacity={0.7}
                                    text={""}
                                    smallCircle={false}
                                    event={{}} />}
                        </SVGViewArea>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <PathsList
                        onChange={(e, path) => this.selectPath(e, path.id)}
                        selectedId={this.state.selectedPathId}
                        values={this.courseInfo.paths}
                    />
                    <RoutesList
                        selectRoute={this.selectRoute}
                        selectedRouteIds={this.state.selectedRouteIds}
                        values={this.state.showRoutes}
                        deleteRoute={this.deleteRoute}
                        voteList={this.props.voteList}
                        uid={this.props.uid}
                        onClick={(route, key) => this.props.voteRoute(this.props.uid, route, key)}
                    />
                    <Divider />
                    <div style={{ float: "right" }}>
                        <NormalButton
                            onClick={() => this.setState(state => ({ isShowUtiliys: !state.isShowUtiliys }))}
                            text="画像のみ表示"
                        />
                        <NormalButton
                            onClick={() => this.handleClick()}
                            text="ルートを書く"
                        />
                    </div>
                </Grid>
            </Grid>

        );
    }
}

export default withRouter(withWidth()(ShowCourse));