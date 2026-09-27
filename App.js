import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Modal,
  ScrollView,
} from "react-native";

const INITIAL_POSTS = [
  {
    id: "1",
    user: "SKSocial",
    avatar: "https://i.pravatar.cc/150?img=12",
    text: "Bienvenue sur SKSocial 🚀",
    image: "https://picsum.photos/700/500?random=1",
    likes: 125,
    liked: false,
    comments: 12,
    following: false,
  },
  {
    id: "2",
    user: "Salif",
    avatar: "https://i.pravatar.cc/150?img=13",
    text: "Ma première publication 🔥",
    image: "https://picsum.photos/700/500?random=2",
    likes: 87,
    liked: false,
    comments: 8,
    following: false,
  },
];

export default function App() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState("Accueil");
  const [search, setSearch] = useState("");
  const [newPost, setNewPost] = useState("");
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // LIKE
  const toggleLike = (id) => {
    setPosts((oldPosts) =>
      oldPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  // FOLLOW
  const toggleFollow = (id) => {
    setPosts((oldPosts) =>
      oldPosts.map((post) =>
        post.id === id
          ? { ...post, following: !post.following }
          : post
      )
    );
  };

  // PUBLICATION
  const publishPost = () => {
    if (!newPost.trim()) {
      Alert.alert("SKSocial", "Écris quelque chose avant de publier.");
      return;
    }

    const post = {
      id: Date.now().toString(),
      user: "Moi",
      avatar: "https://i.pravatar.cc/150?img=15",
      text: newPost,
      image: null,
      likes: 0,
      liked: false,
      comments: 0,
      following: false,
    };

    setPosts([post, ...posts]);
    setNewPost("");

    Alert.alert("Publié ✅", "Ta publication a été ajoutée.");
  };

  // COMMENTAIRE
  const addComment = () => {
    if (!selectedPost || !commentText.trim()) return;

    const id = selectedPost.id;

    setComments({
      ...comments,
      [id]: [
        ...(comments[id] || []),
        {
          id: Date.now().toString(),
          user: "Moi",
          text: commentText,
        },
      ],
    });

    setPosts((oldPosts) =>
      oldPosts.map((post) =>
        post.id === id
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );

    setCommentText("");
  };

  const sharePost = () => {
    Alert.alert(
      "Partager 📤",
      "Le système de partage sera connecté au backend plus tard."
    );
  };

  // FILTRE RECHERCHE
  const filteredPosts = posts.filter(
    (post) =>
      post.user.toLowerCase().includes(search.toLowerCase()) ||
      post.text.toLowerCase().includes(search.toLowerCase())
  );

  // ACCUEIL
  const renderHome = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>SKSocial</Text>

        <TouchableOpacity onPress={() => setSettingsVisible(true)}>
          <Text style={styles.headerIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="🔎 Rechercher..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.createBox}>
        <TextInput
          style={styles.postInput}
          placeholder="Quoi de neuf ?"
          value={newPost}
          onChangeText={setNewPost}
          multiline
        />

        <TouchableOpacity
          style={styles.publishButton}
          onPress={publishPost}
        >
          <Text style={styles.publishText}>Publier</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <View style={styles.userRow}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />

              <View style={{ flex: 1 }}>
                <Text style={styles.username}>{item.user}</Text>
                <Text style={styles.time}>Maintenant</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.followButton,
                  item.following && styles.followingButton,
                ]}
                onPress={() => toggleFollow(item.id)}
              >
                <Text style={styles.followText}>
                  {item.following ? "Suivi ✓" : "Suivre"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.postText}>{item.text}</Text>

            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={styles.postImage}
              />
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => toggleLike(item.id)}
                style={styles.action}
              >
                <Text style={item.liked ? styles.liked : styles.actionText}>
                  {item.liked ? "❤️" : "🤍"} {item.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedPost(item)}
                style={styles.action}
              >
                <Text style={styles.actionText}>
                  💬 {item.comments}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={sharePost}
                style={styles.action}
              >
                <Text style={styles.actionText}>📤 Partager</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );

  // PROFIL
  const renderProfile = () => (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: "https://i.pravatar.cc/200?img=15" }}
          style={styles.bigAvatar}
        />

        <Text style={styles.profileName}>Mon profil</Text>
        <Text style={styles.usernameText}>@sksocial</Text>

        <View style={styles.stats}>
          <View>
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>Publications</Text>
          </View>

          <View>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Abonnés</Text>
          </View>

          <View>
            <Text style={styles.statNumber}>85</Text>
            <Text style={styles.statLabel}>Suivis</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            Alert.alert("Profil", "Modification du profil bientôt disponible.")
          }
        >
          <Text style={styles.editText}>Modifier le profil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // NOTIFICATIONS
  const renderNotifications = () => (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Notifications 🔔</Text>

      <View style={styles.notification}>
        <Text style={styles.notificationText}>
          ❤️ Quelqu'un a aimé ta publication.
        </Text>
      </View>

      <View style={styles.notification}>
        <Text style={styles.notificationText}>
          👤 Un utilisateur te suit maintenant.
        </Text>
      </View>

      <View style={styles.notification}>
        <Text style={styles.notificationText}>
          💬 Nouveau commentaire sur ta publication.
        </Text>
      </View>
    </View>
  );

  // PARAMÈTRES
  const renderSettings = () => (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Paramètres ⚙️</Text>

      <TouchableOpacity style={styles.setting}>
        <Text style={styles.settingText}>👤 Compte</Text>
        <Text>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.setting}>
        <Text style={styles.settingText}>🔒 Confidentialité</Text>
        <Text>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.setting}>
        <Text style={styles.settingText}>🔔 Notifications</Text>
        <Text>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.setting}>
        <Text style={styles.settingText}>💰 Monétisation</Text>
        <Text>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.setting}>
        <Text style={styles.settingText}>📱 Version bêta</Text>
        <Text>1.0.0</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.setting}>
        <Text style={styles.settingText}>📩 Assistance</Text>
        <Text>sksocial2030@gmail.com</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logout}
        onPress={() =>
          Alert.alert("SKSocial", "Déconnexion bientôt disponible.")
        }
      >
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (activeTab === "Profil") return renderProfile();
    if (activeTab === "Notifications") return renderNotifications();
    if (activeTab === "Paramètres") return renderSettings();

    return renderHome();
  };

  return (
    <SafeAreaView style={styles.app}>
      {renderContent()}

      {/* NAVIGATION */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => setActiveTab("Accueil")}
          style={styles.navItem}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("Notifications")}
          style={styles.navItem}
        >
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navText}>Alertes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={publishPost}
          style={styles.addButton}
        >
          <Text style={styles.addText}>＋</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("Profil")}
          style={styles.navItem}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSettingsVisible(true)}
          style={styles.navItem}
        >
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Paramètres</Text>
        </TouchableOpacity>
      </View>

      {/* COMMENTAIRES */}
      <Modal
        visible={selectedPost !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.commentBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Commentaires 💬</Text>

              <TouchableOpacity
                onPress={() => setSelectedPost(null)}
              >
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={
                selectedPost
                  ? comments[selectedPost.id] || []
                  : []
              }
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={styles.empty}>
                  Aucun commentaire pour le moment.
                </Text>
              }
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text>{item.text}</Text>
                </View>
              )}
            />

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Écrire un commentaire..."
                value={commentText}
                onChangeText={setCommentText}
              />

              <TouchableOpacity
                style={styles.sendButton}
                onPress={addComment}
              >
                <Text style={styles.sendText}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* PARAMÈTRES RAPIDES */}
      <Modal
        visible={settingsVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.settingsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Paramètres ⚙️</Text>

              <TouchableOpacity
                onPress={() => setSettingsVisible(false)}
              >
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.setting}>
              <Text style={styles.settingText}>👤 Mon compte</Text>
              <Text>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.setting}>
              <Text style={styles.settingText}>
                🔒 Confidentialité
              </Text>
              <Text>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.setting}>
              <Text style={styles.settingText}>
                💰 Monétisation
              </Text>
              <Text>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.setting}>
              <Text style={styles.settingText}>📩 Assistance</Text>
              <Text>›</Text>
            </TouchableOpacity>

            <Text style={styles.email}>
              sksocial2030@gmail.com
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  container: {
    flex: 1,
    padding: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  logo: {
    fontSize: 27,
    fontWeight: "bold",
  },

  headerIcon: {
    fontSize: 25,
  },

  search: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  createBox: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
  },

  postInput: {
    minHeight: 45,
    textAlignVertical: "top",
    fontSize: 16,
  },

  publishButton: {
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },

  publishText: {
    color: "white",
    fontWeight: "bold",
  },

  post: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },

  username: {
    fontWeight: "bold",
    fontSize: 16,
  },

  time: {
    color: "#888",
    fontSize: 12,
  },

  followButton: {
    backgroundColor: "#111",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
  },

  followingButton: {
    backgroundColor: "#ddd",
  },

  followText: {
    color: "white",
    fontWeight: "bold",
  },

  postText: {
    fontSize: 16,
    marginBottom: 10,
  },

  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 10,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },

  action: {
    padding: 5,
  },

  actionText: {
    fontSize: 14,
  },

  liked: {
    fontSize: 14,
  },

  bottomNav: {
    height: 65,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
  },

  navIcon: {
    fontSize: 20,
  },

  navText: {
    fontSize: 10,
    marginTop: 2,
  },

  addButton: {
    backgroundColor: "#111",
    width: 48,
    height: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  addText: {
    color: "white",
    fontSize: 30,
    lineHeight: 32,
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  profileHeader: {
    alignItems: "center",
    paddingTop: 20,
  },

  bigAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },

  usernameText: {
    color: "#777",
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 25,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  statLabel: {
    color: "#777",
  },

  profileButtons: {
    marginTop: 25,
  },

  editButton: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  editText: {
    color: "white",
    fontWeight: "bold",
  },

  notification: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
  },

  notificationText: {
    fontSize: 16,
  },

  setting: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  settingText: {
    fontSize: 16,
  },

  logout: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  commentBox: {
    backgroundColor: "white",
    height: "75%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },

  settingsModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    paddingBottom: 30,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: "bold",
  },

  close: {
    fontSize: 25,
  },

  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 30,
  },

  comment: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },

  commentUser: {
    fontWeight: "bold",
    marginBottom: 3,
  },

  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  commentInput: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 20,
  },

  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  sendText: {
    color: "white",
    fontSize: 20,
  },

  email: {
    textAlign: "center",
    color: "#777",
    marginTop: 10,
  },
});