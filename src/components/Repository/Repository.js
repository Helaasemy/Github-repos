import React, { Component } from 'react';
import { Row, Col, Skeleton, Card, Badge } from 'antd';
import formatDistance from 'date-fns/formatDistance';
import debounce from 'lodash.debounce';
import { fetchRepos } from '../../Github';
import './Repository.css';

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
        if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {
            this.setState({ currentPage: this.state.currentPage + 1 }, () => {
                fetchRepos(this.state.currentPage)
                    .then(repositories => {
                        this.setState({ repositories: [...this.state.repositories, ...repositories] });
                    })
            })
        }
    }

    render() {
        if (this.state.loading) {
            return <Row gutter={16} >
                <Col span={16} className="row">
                    <Skeleton avatar paragraph={{ rows: 4 }} />
                </Col>
            </Row>;
        } else {
            return (
                <>
                    <Row gutter={16} >
                        <Col span={16} className="row">
                            {this.state.repositories.map(repo =>
                                <div key={repo.id} className="site-card-border-less-wrapper">
                                    <Col >
                                        <img
                                            className="avatar"
                                            src={`${repo.owner.avatar_url}`}
                                            alt="test"
                                        />
                                    </Col>
                                    <Card title={repo.name} bordered={true} className="card">
                                        <p>{repo.description}</p>
                                        <Row>
                                            <Col >
                                                <Badge className="site-badge-count-109" count={`stars : ${repo.stargazers_count} `} style={{ backgroundColor: '#52c41a' }} />
                                            </Col>
                                            <Col >
                                                <Badge className="site-badge-count-109" count={`  Issues : ${repo.open_issues_count}`} style={{ backgroundColor: '#52c41a' }} />
                                            </Col>
                                            <Col >
                                                <p>Submitted  {formatDistance(new Date(), new Date(repo.created_at))} ago by {repo.owner.login}</p>
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
