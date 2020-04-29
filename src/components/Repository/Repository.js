import React, { Component } from 'react';
import { Row, Col, Skeleton, Card, Badge } from 'antd';
import formatDistance from 'date-fns/formatDistance';
import debounce from 'lodash.debounce'
import { fetchRepos } from "../../Github";

class Repository extends Component {
    constructor(props) {
        super(props)
        this.state = {
            repositories: [],
            loading: false,
            currentPage: 1,
        }
        this.loadMore = this.loadMore.bind(this)
        this.getUsers = this.getUsers.bind(this)
    }

    getUsers() {
        this.setState({ loading: true }, () => {
            fetchRepos()
                .then(repositories => {
                    this.setState({ repositories, loading: false });
                })
        })
    }

    componentDidMount() {
        this.getUsers();
        window.addEventListener('scroll', debounce(this.loadMore, 300))
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.loadMore);
    }

    loadMore() {
        console.log("daz mn hna: ");

        if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {
            this.setState({ currentPage: this.state.currentPage + 1 }, () => {
                console.log("Current Page : ", this.state.currentPage);

                fetchRepos(this.state.currentPage)
                    .then(repositories => {
                        this.setState({ repositories: [...this.state.repositories, ...repositories] });
                    })
            })
        }
    }

    render() {
        if (this.state.loading) {
            return <Skeleton />;
        } else {
            return (
                <>
                    <Row gutter={16}>
                        <Col span={6}>
                            {/* <img
                                src={`https://cdn.iconscout.com/icon/free/png-512/avatar-380-456332.png`}
                                alt="test"
                            /> */}
                        </Col>
                        <Col span={6}>
                            {this.state.repositories.map(repo =>
                                <div key={repo.id} className="site-card-border-less-wrapper">
                                    <Card title={repo.name} bordered={true} style={{ width: 600 }}>
                                        <p>{repo.description}</p>
                                        <Row>
                                            <Col >
                                                <Badge className="site-badge-count-109" count={`stars : ${repo.stargazers_count}`} style={{ backgroundColor: '#52c41a' }} />
                                            </Col>
                                            <Col >
                                                <Badge className="site-badge-count-109" count={`stars : ${repo.open_issues_count}`} style={{ backgroundColor: '#52c41a' }} />
                                            </Col>
                                            <Col >
                                                <p>Submitted  {formatDistance(new Date(), new Date(repo.created_at))} by {repo.owner.login}</p>
                                            </Col>
                                        </Row>

                                    </Card>
                                </div>
                            )}
                        </Col>
                    </Row>
                </>
            );
        }
    };
};
export default Repository;
