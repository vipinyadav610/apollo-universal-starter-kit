import React from 'react';
import { withApollo } from 'react-apollo';
import faGithubSquare from '@fortawesome/fontawesome-free-brands/faGithubSquare';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button } from '@module/look-client-react';
import authentication from '@module/authentication-client-react';

import './GitHubButton.css';

const githubLogin = () => {
  window.location = '/auth/github';
};

const GitHubButton = withApollo(({ client, text }) => {
  return (
    <Button
      type="button"
      size="lg"
      onClick={() => authentication.doLogin(client).then(githubLogin)}
      className="githubBtn"
    >
      <div className="iconContainer">
        <FontAwesomeIcon icon={faGithubSquare} className="githubIcon" />
        <div className="separator" />
      </div>
      <div className="btnText">
        <span>{text}</span>
      </div>
    </Button>
  );
});

const GitHubLink = withApollo(({ client, text }) => {
  return (
    <Button color="link" onClick={() => authentication.doLogin(client).then(githubLogin)} style={{ marginTop: 10 }}>
      {text}
    </Button>
  );
});

const GitHubIcon = withApollo(({ client }) => {
  return (
    <FontAwesomeIcon
      icon={faGithubSquare}
      style={{ marginTop: 10, color: '#5f5e5e', fontSize: 40 }}
      onClick={() => authentication.doLogin(client).then(githubLogin)}
    />
  );
});

const GithubComponent = ({ text, type }) => {
  switch (type) {
    case 'button':
      return <GitHubButton text={text} />;
    case 'link':
      return <GitHubLink text={text} />;
    case 'icon':
      return <GitHubIcon />;
    default:
      return <GitHubButton text={text} />;
  }
};

export default GithubComponent;
