import * as React from 'react';
import { SampleControls } from '../../common-elements';
import { OperationModel } from '../../services';
import styled from '../../styled-components';
import { OptionsContext } from '../OptionsProvider';
import {
  EndpointInfo,
  HttpVerb,
  OperationEndpointWrap,
  ServerRelativeURL,
} from './styled.elements';

export interface EndpointProps {
  operation: OperationModel;

  hideHostname?: boolean;
  inverted?: boolean;
  compact?: boolean;
}

export interface EndpointState {
  expanded: boolean;
}

const TryItWrap = styled.div`
  &:hover > ${SampleControls} {
    opacity: 1;
  }
`;

export class Endpoint extends React.Component<EndpointProps, EndpointState> {
  static contextType = OptionsContext;

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  tryItOut = () => {
    const { operation } = this.props;
    const tryButtonUrl = this.context.tryButtonUrl;
    window.open(tryButtonUrl + '?scrollTo=page-' + operation.operationId, '_blank');
  };

  render() {
    const { operation } = this.props;

    // TODO: highlight server variables, e.g. https://{user}.test.com
    return (
      <OptionsContext.Consumer>
        {options => (
          <OperationEndpointWrap>
            <EndpointInfo onClick={this.toggle} expanded={expanded} inverted={inverted}>
              <HttpVerb type={operation.httpVerb} compact={this.props.compact}>
                {operation.httpVerb}
              </HttpVerb>
              <ServerRelativeURL>{operation.path}</ServerRelativeURL>
              {options.tryButtonUrl !== false &&
                <TryItWrap>
                  <SampleControls>
                    <span onClick={this.tryItOut}> Try it out </span>
                  </SampleControls>
                </TryItWrap>
              }
            </EndpointInfo>
            <ServersOverlay expanded={expanded} aria-hidden={!expanded}>
              {operation.servers.map(server => {
                const normalizedUrl = options.expandDefaultServerVariables
                  ? expandDefaultServerVariables(server.url, server.variables)
                  : server.url;
                return (
                  <ServerItem key={normalizedUrl}>
                    <Markdown source={server.description || ''} compact={true} />
                    <SelectOnClick>
                      <ServerUrl>
                        <span>
                          {hideHostname || options.hideHostname
                            ? getBasePath(normalizedUrl)
                            : normalizedUrl}
                        </span>
                        {operation.path}
                      </ServerUrl>
                    </SelectOnClick>
                  </ServerItem>
                );
              })}
            </ServersOverlay>
          </OperationEndpointWrap>
        )}
      </OptionsContext.Consumer>
    );
  }
}
