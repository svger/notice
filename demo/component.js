import React from 'react';
import Notice from "../src/index";
import styles from "./style/index.less";
import { login } from "../../utils/authUtils";

class App extends React.Component {

  handleLoginClick = () => {
    login(this.constant.fundId, this.state.pwdValue)
      .then(this.fetchNotices)
      .then(() => {
        const { location } = this.props;
        if (location.state && location.state.nextPathname) {
          browserHistory.replace({
            pathname: location.state.nextPathname,
            query: location.state.nextQuery
          });
        } else {
          /*window global*/
          window.location.href = getOS().link;
        }
      });
  };

  fetchNotices = () => {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: API.NEWS,
        headers: {
          token: readCookie("token")
        },
        params: {
          channel: "01",
          data: {
            method: API.QUERY_NOTICES,
            fundId: this.constant.fundId
          }
        },
        onSuccess: res => {
          const { notices } = res;
          if (notices && notices.length) {
            return reactDOM.render(
              <Notice
                theme="black"
                headerCloseIcon="black"
                data={notices}
                title="提示"
                onClose={resolve}
              />,
              messageBoxContainer
            );
          }

          resolve();
        },
        onError: reject,
        loadingConfig: { withoutLoading: false }
      });
    });
  };

  render() {
    return <div>
        <button className="cefc-button" onClick={this.handleLoginClick}>
          handleLoginClick
        </button>
      </div>;
  }
}

export default App;
