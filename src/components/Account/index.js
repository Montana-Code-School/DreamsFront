import React from 'react';

//styles
import { AuthFormTitleS } from '../styledComponents/formTitles';
import { PageStyleS, BlobContainer1S } from './styled';
import ColorBlob from '../ColorBlob';

import { AuthUserContext, withAuthorization } from '../Session';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => (

  <AuthUserContext.Consumer>
    {authUser => (
      <PageStyleS>
        <BlobContainer1S>
          <ColorBlob/>
        </BlobContainer1S>
        <AuthFormTitleS
          formTitleBottomMargin={0}
          formTitleTopMargin={-80}
        >Account: {authUser.email}</AuthFormTitleS>
        <PasswordChangeForm />
      </PageStyleS>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
