'use strict';
import React, { Component } from 'react';
import classNames from 'classnames';
import MsgModal from '@cefc-ui/MsgModal'
import styles from './style/index.less'

class Notice extends Component {
    state = {
        pagenum: 1 , //当前页码
        preBtnCls: '', //上一条的样式
    };

    componentWillMount() {
        const { data } = this.props;
        const { pagenum } = this.state;

        let preBtn = false;

        const preBtnCls = classNames({
            btn: true,
            prevBtnChange: pagenum === 1,
        });

        this.setState({
            totalPage: data.length,
            preBtnCls,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { data } = this.props;
        const nextData = nextProps.data;

        if (nextData !== data || nextData.length !== data.length) {
            this.setState({
                totalPage: data.length
            });
        }
    }
    //下一页
    setNext = () => {
        const { pagenum, totalPage } = this.state;
        const { data } = this.props;
        let nextPageNum;

        let preBtn = false;

        if (pagenum === totalPage) {
            nextPageNum = 1;
        }
        const preBtnCls = classNames({
            btn: true,
            prevBtnChange: nextPageNum === 1,
        });
        if (pagenum < totalPage) {
            nextPageNum = pagenum + 1;
        }
        this.setState({
            pagenum: nextPageNum,
            preBtnCls,
        });
    };

    //上一页
    setUp = () => {
        return () => {
            const { pagenum } = this.state;
            if (pagenum === 1) {
                return ;
            }
            const { data } = this.props;
            let lastPageNum;
            let preBtn = false;

            if (pagenum > 1 ) {
                lastPageNum = pagenum - 1;
            }
            const preBtnCls = classNames({
                btn: true,
                prevBtnChange: lastPageNum === 1,
            });
            this.setState({
                pagenum: lastPageNum,
                preBtnCls,
            });
        }
    };

    renderNoticeList() {
        let { pagenum, totalPage, preBtnCls } = this.state;
        const { data } = this.props;
        let nextPage = pagenum !== totalPage;

        return (
            <div className="container">
              <div className="contentTitle">
                  {data[pagenum - 1].noticeTitle}
              </div>
              <div className="contentNotice" dangerouslySetInnerHTML={{
                  __html: data[pagenum - 1].noticeContent.replace(/[\r\n]/g, '<br/>')
              }} />
              <div className="pagination">
                <div onClick={this.setUp(pagenum)} className={preBtnCls}>上一条</div>
                <div className="page"> {pagenum}/{totalPage}</div>
                <div onClick={this.setNext} className="btn">{nextPage ? "下一条" : "回到第一条"}</div>
              </div>
            </div>
        );
    }

    renderSingleNotice() {
        const { data, stl } = this.props;

        return (
            <div>
              <div className="containerTitle">
                  {data[0].noticeTitle}
              </div>
              <div className="singleNotice" dangerouslySetInnerHTML={{
                  __html: data[0].noticeContent.replace(/[\r\n]/g, '<br/>')
              }} />
            </div>
        );
    }

    render() {
        const { totalPage } = this.state;
        const { title, onClose, theme, headerCloseIcon } = this.props;
        const single = totalPage === 1;

        let msgModalProps = {
            title,
            theme,
            headerCloseIcon,
            type: 'text'
        };

        if (single) {
            msgModalProps.defaultBtnObj = {
                txt: '我知道了'
            };
        }

        return (
            <MsgModal {...msgModalProps} onHide={onClose}>
                {single ? this.renderSingleNotice() : this.renderNoticeList()}
            </MsgModal>
        );
    }
}
Notice.defaultProps = {
    theme: 'white',
    title: '公告',
    headerCloseIcon: 'black',
    onClose() {
    }
};

export default Notice;
 