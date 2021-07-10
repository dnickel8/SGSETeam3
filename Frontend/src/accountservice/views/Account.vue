<template>
  <v-container fill-height fluid>
    <div style="width: 100%">
      <v-row class="d-flex justify-center mb-6">
        <v-card>
          <v-card-title>Benutzerprofil</v-card-title>
          <v-card-text>
            <LoggedInUser :userProfile="userProfile" />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="logout" v-if="$keycloak.authenticated" color="amber">
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import LoggedInUser from "@/accountservice/components/LoggedInUser.vue";

export default {
  name: "Account",
  components: {
    LoggedInUser,
  },
  async created() {
    if (this.$keycloak.authenticated) {
      this.userProfile = await this.$keycloak.loadUserProfile();
    }
  },
  data() {
    return {
      userProfile: null,
    };
  },
  methods: {
    async logout() {
      await this.$keycloak.logoutFn();
    },
  },
};
</script>
