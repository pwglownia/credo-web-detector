<script>
  import { appRoute } from "../../store";
</script>

<p>The app is in development phase. Therefore login is disabled.</p>
<p>You can proceed as anonymous user.</p>
<sl-button
  on:click={() => {
    appRoute.set('detector');
  }}
  type="primary">
  Start
</sl-button>

<!-- 
  Code below will be added after general testing phase
 -->

<!-- <sl-card login>
  <h1>Sign In</h1>

  <form>
    <sl-input disabled type="email" placeholder="Email" size="small" />
    <sl-input
      disabled
      type="password"
      placeholder="Password"
      size="small"
      toggle-password />
    <sl-button disabled type="primary">Login</sl-button>
  </form>

  <p>
    New user?
    <a href="/">register</a>
    <br />
    Can't login?
    <a href="/">reset password</a>
  </p>
</sl-card> -->
