import React from 'react';

//styles
import { AuthFormTitles } from '../styledComponents/formTitles';
import { PageStyleS, BlobInputContainerSS } from './styled';
import ColorBlob from '../ColorBlob';

import { AuthUserContext, withAuthorization } from '../Session';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => (

  <AuthUserContext.Consumer>
    {authUser => (
      <PageStyleS>
        <BlobInputContainerSS>
          <ColorBlob/>
        </BlobInputContainerSS>
        <AuthFormTitles
          formTitleBottomMargin={0}
          formTitleTopMargin={-80}
        >Account: {authUser.email}</AuthFormTitles>
        <PasswordChangeForm />
      </PageStyleS>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
