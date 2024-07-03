import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Usuario | Plaza San Miguel</title>
      </Helmet>

      <UserView />
    </>
  );
}
