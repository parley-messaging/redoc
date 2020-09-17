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
            <EndpointInfo>
              <HttpVerb type={operation.httpVerb}> {operation.httpVerb}</HttpVerb>{' '}
              <ServerRelativeURL>{operation.path}</ServerRelativeURL>
              {options.tryButtonUrl !== false &&
                <TryItWrap>
                  <SampleControls>
                    <span onClick={this.tryItOut}> Try it out </span>
                  </SampleControls>
                </TryItWrap>
              }
            </EndpointInfo>
          </OperationEndpointWrap>
        )}
      </OptionsContext.Consumer>
    );
  }
}
