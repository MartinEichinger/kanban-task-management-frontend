import React from 'react';
import styled from '@emotion/styled';

type TLayoutScreen = {
  children: any;
  sideBarCollapse?: boolean;
  navHeight?: string;
  col1Width?: string;
};

export const LogoNavContentScreen: React.FC<TLayoutScreen> = ({
  children,
  navHeight = '100px',
  col1Width = '300px',
  sideBarCollapse = false,
}) => {
  const [logo, nav, sidebar, content] = children;
  //const collapse = true;

  return (
    <ScreenMain className="screen-main d-flex flex-column">
      <UpPane className="up-pane d-flex flex-row" navHeight={navHeight}>
        <LeftUpPane className="d-none d-sm-block" col1Width={col1Width}>
          {logo}
        </LeftUpPane>
        <RightUpPane col1Width={col1Width}>{nav}</RightUpPane>
      </UpPane>
      <DownPane className="down-pane d-flex flex-row" navHeight={navHeight}>
        <LeftDownPane
          className="d-none d-sm-block"
          col1Width={col1Width}
          navHeight={navHeight}
          sideBarCollapse={sideBarCollapse}
        >
          {sidebar}
        </LeftDownPane>
        <RightDownPane col1Width={col1Width} navHeight={navHeight} sideBarCollapse={sideBarCollapse}>
          {content}
        </RightDownPane>
      </DownPane>
    </ScreenMain>
  );
};

const ScreenMain = styled.div`
  width: 100vw;
  height: 100vh;
  //background-color: red;
`;

type TUpPane = {
  navHeight: string;
};
const UpPane = styled.div<TUpPane>`
  height: ${({ navHeight }) => navHeight};
`;

const DownPane = styled.div<TUpPane>`
  height: ${({ navHeight }) => `calc(100vh - ${navHeight})`};
`;

type TLeftPane = {
  col1Width: string;
};
const LeftUpPane = styled.div<TLeftPane>`
  width: ${({ col1Width }) => col1Width};
`;

const RightUpPane = styled.div<TLeftPane>`
  width: ${({ col1Width }) => `calc(100vw - ${col1Width})`};

  @media (max-width: 575px) {
    width: 100vw;
  }
`;

type TCollapsePane = {
  sideBarCollapse: boolean;
};
const LeftDownPane = styled.div<TLeftPane & TUpPane & TCollapsePane>`
  width: ${({ col1Width, sideBarCollapse }) => (sideBarCollapse ? '0px' : col1Width)};
  height: 100%;
`;

const RightDownPane = styled.div<TLeftPane & TUpPane & TCollapsePane>`
  width: ${({ col1Width, sideBarCollapse }) =>
    sideBarCollapse ? '100vw' : `calc(100vw - ${col1Width})`};
  height: 100%;

  @media (max-width: 575px) {
    width: 100vw;
  }
`;
