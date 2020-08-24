<script>
  import { route } from "../../router";
</script>

<style>
  section {
    width: 100%;
  }

  [temp] {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
  }

  [login] {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  form > * {
    margin-bottom: 10px;
  }
</style>

<section temp class="box">
  <p>
    The app is in development phase. Therefore login is disabled. You can
    proceed as anonymous user.
  </p>
  <sl-button
    on:click={() => {
      route.set('detector');
    }}
    type="primary">
    Start
  </sl-button>
</section>
<section login class="box">

  <h1>Sign In</h1>

  <form>
    <label>email</label>
    <input type="email" />
    <label>password</label>
    <input type="password" />
    <button>login</button>
  </form>

  <p>
    New user?
    <a href="">register</a>
    <br />
    Can't login?
    <a href="">reset password</a>
  </p>
</section>
