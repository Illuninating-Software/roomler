<template>
  <client-only>
    <v-navigation-drawer
      v-model="rightDrawer"
      :mini-variant.sync="mini"
      app
      clipped
      right
      expand-on-hover
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>fa-users</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>ROOM PEERS</v-list-item-title>
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider />
      <v-list dense>
        <v-list-item
          v-for="user in roomPeers"
          :key="user._id"
          :to="`/@/${user.username}`"
          link
        >
          <v-list-item-icon>
            <v-badge
              :color="isInCall(user._id) ? 'red' : isOnline(user._id) ? 'green' : 'grey'"
              bordered
              bottom
              left
              avatar
              overlap
              offset-x="5"
              offset-y="5"
            >
              <template v-if="isInCall(user._id)" v-slot:badge>
                <v-avatar v-if="isInCall(user._id)" size="12">
                  <v-icon size="7" style="margin-bottom: 6px">
                    fa fa-phone
                  </v-icon>
                </v-avatar>
              </template>

              <v-avatar
                size="36px"
              >
                <img v-if="user.avatar_url" :src="user.avatar_url">
                <v-icon v-if="!user.avatar_url">
                  fa-user
                </v-icon>
              </v-avatar>
            </v-badge>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ user.username }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </client-only>
</template>

<script>
export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    room: {
      type: Object,
      default () {
        return null
      }
    },
    peers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      rightDrawer: true,
      mini: true
    }
  },
  computed: {
    roomPeers () {
      return this.room ? this.$store.getters['api/auth/getRoomPeers'](this.room) : []
    }
  },
  watch: {
    drawer (value) {
      this.rightDrawer = value
    },
    rightDrawer (value) {
      if (value !== this.drawer) {
        this.$store.commit('panel/toggle', 'right')
      }
    }
  },
  methods: {
    isOnline (userid) {
      return this.$store.getters['api/auth/isOnline'](userid)
    },
    isInCall (userid) {
      return this.$store.getters['api/room/calls/isUserInCall'](userid)
    }
  }
}
</script>

<style scoped>
* >>> .v-badge__badge {
  height: 12px;
  min-width: 12px;
  padding: 0px;
}
* >>> .v-badge--bordered .v-badge__badge::after {
  border-width: 1px;
}
</style>
