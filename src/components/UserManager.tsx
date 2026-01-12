import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, IconButton, Portal, Dialog, Chip, Button, Searchbar, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { User, UserRole } from '../types/user';
import { getUsers, toggleUserStatus, deleteUser, PaginatedResponse } from '../services/userService';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../theme';

export const UserManager = () => {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadUsers(1);
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const loadUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      const response: PaginatedResponse = await getUsers(page, 20);
      setUsers(response.data);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (id: number) => {
    router.push(`/edit-user/${id}`);
  };

  const confirmDelete = (id: number) => {
    setUserToDelete(id);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      await deleteUser(userToDelete);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
      setDeleteDialogVisible(false);
      setUserToDelete(null);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      setLoading(true);
      await toggleUserStatus(id);
      await loadUsers(currentPage);
    } catch (error) {
      console.error('Error toggling user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadUsers(newPage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Buscador y contador */}
      <View style={styles.headerSection}>
        <Searchbar
          placeholder="Buscar por nombre, email..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <Text style={styles.totalText}>Total: {total} usuarios</Text>
      </View>

      {/* Lista */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isCurrentUser = currentUser?.id === item.id;
          
          return (
            <View style={styles.itemCard}>
              <View style={styles.leftSection}>
                <View style={styles.userInfo}>
                  <Text style={styles.username} numberOfLines={1}>
                    {item.username}{isCurrentUser && <Text style={styles.youBadge}> (Tú)</Text>}
                  </Text>
                  <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
                </View>
                <Chip
                  compact
                  textStyle={styles.roleChipText}
                  style={[
                    styles.roleChip,
                    item.role === UserRole.ADMIN ? styles.adminChip : styles.userChip
                  ]}
                >
                  {item.role === UserRole.ADMIN ? 'Admin' : 'User'}
                </Chip>
                <View style={[
                  styles.statusBadge,
                  item.status === 'active' ? styles.activeBadge : styles.inactiveBadge
                ]} />
              </View>
              <View style={styles.actions}>
                <IconButton
                  icon={item.status === 'active' ? 'eye-off' : 'eye'}
                  size={18}
                  onPress={() => handleToggleStatus(item.id)}
                  iconColor={item.status === 'active' ? colors.light.primary : colors.light.textSecondary}
                  disabled={isCurrentUser}
                  style={styles.actionButton}
                />
                <IconButton
                  icon="pencil"
                  size={18}
                  onPress={() => handleEdit(item.id)}
                  style={styles.actionButton}
                />
              </View>
            </View>
          );
        }}
        refreshing={loading}
        onRefresh={() => loadUsers(currentPage)}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay usuarios</Text>
        }
      />

      {/* Paginación */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <IconButton
            icon="chevron-left"
            size={24}
            disabled={currentPage === 1 || loading}
            onPress={() => handlePageChange(currentPage - 1)}
          />
          <Text style={styles.pageText}>
            Página {currentPage} de {totalPages}
          </Text>
          <IconButton
            icon="chevron-right"
            size={24}
            disabled={currentPage === totalPages || loading}
            onPress={() => handlePageChange(currentPage + 1)}
          />
        </View>
      )}

      {/* FAB para crear nuevo usuario */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/create-user')}
      />

      {/* Dialog de confirmación */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Confirmar eliminación</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro de eliminar este usuario? Esta acción es irreversible.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleDelete}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    marginBottom: 8,
  },
  searchbar: {
    marginBottom: 8,
  },
  totalText: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginLeft: 4,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 80,
  },
  itemCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  youBadge: {
    color: colors.light.primary,
    fontWeight: '600',
    fontSize: 11,
  },
  email: {
    fontSize: 11,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  roleChip: {
    height: 24,
    marginLeft: 8,
  },
  roleChipText: {
    fontSize: 9,
    marginVertical: 0,
  },
  adminChip: {
    backgroundColor: '#ff9800',
  },
  userChip: {
    backgroundColor: '#2196f3',
  },
  statusBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: '#4caf50',
  },
  inactiveBadge: {
    backgroundColor: '#f44336',
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    margin: 0,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: colors.light.surface,
  },
  pageText: {
    fontSize: 14,
    marginHorizontal: 16,
    color: colors.light.text,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.light.primary,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: colors.light.textSecondary,
  },
});
