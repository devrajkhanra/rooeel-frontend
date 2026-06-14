import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Edit,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { createProjectClient, graphQLClient } from '../../lib/graphql-client';
import { MY_PROJECTS_QUERY } from '../../lib/graphql/projects.operations';
import {
  ADMIN_USERS_QUERY,
  CREATE_ADMIN_USER_MUTATION,
  DELETE_ADMIN_USER_MUTATION,
  UPDATE_ADMIN_USER_MUTATION,
} from '../../lib/graphql/users.operations';
import { useAuthStore } from '../../store/useAuthStore';
import type { Project } from '../../types/project.types';
import type { AdminUser, UserStatus } from '../../types/user.types';
import { UserFormModal, type UserEditFormValues, type UserFormValues } from './UserFormModal';

const STATUS_STYLES: Record<UserStatus, string> = {
  ACTIVE: 'bg-[#dcfce7] text-[#166534]',
  INVITED: 'bg-[#e8f0fe] text-[#0066cc]',
  SUSPENDED: 'bg-[#fee2e2] text-[#991b1b]',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function compactError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['myProjects'],
    queryFn: async () => {
      const result = await graphQLClient.request<{ myProjects: Project[] }>(
        MY_PROJECTS_QUERY,
      );
      return result.myProjects;
    },
  });

  const activeProjectId = selectedProjectId || projects?.[0]?.id || '';
  const selectedProject = projects?.find((project) => project.id === activeProjectId);
  const client = useMemo(
    () => (activeProjectId ? createProjectClient(activeProjectId) : null),
    [activeProjectId],
  );

  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch,
  } = useQuery({
    queryKey: ['adminUsers', activeProjectId],
    queryFn: async () => {
      if (!client) return [];
      const result = await client.request<{ adminUsers: AdminUser[] }>(
        ADMIN_USERS_QUERY,
        { take: 100 },
      );
      return result.adminUsers;
    },
    enabled: Boolean(client),
  });

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['adminUsers', activeProjectId] });
  };

  const createMutation = useMutation({
    mutationFn: async (values: UserFormValues | UserEditFormValues) => {
      if (!client) throw new Error('Select a project before managing users.');
      const input = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };
      await client.request(CREATE_ADMIN_USER_MUTATION, { input });
    },
    onSuccess: () => {
      setFormError(null);
      setIsCreateOpen(false);
      invalidateUsers();
    },
    onError: (error) => setFormError(compactError(error, 'Failed to create user.')),
  });

  const updateMutation = useMutation({
    mutationFn: async (values: UserFormValues | UserEditFormValues) => {
      if (!client || !editingUser) throw new Error('No user selected.');
      const password = values.password?.trim();
      await client.request(UPDATE_ADMIN_USER_MUTATION, {
        input: {
          userId: editingUser.id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          status: values.status,
          ...(password ? { password } : {}),
        },
      });
    },
    onSuccess: () => {
      setFormError(null);
      setEditingUser(null);
      invalidateUsers();
    },
    onError: (error) => setFormError(compactError(error, 'Failed to update user.')),
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!client) throw new Error('Select a project before managing users.');
      await client.request(DELETE_ADMIN_USER_MUTATION, { userId });
    },
    onSuccess: () => {
      setActionError(null);
      setDeletingId(null);
      invalidateUsers();
    },
    onError: (error) => {
      setDeletingId(null);
      setActionError(compactError(error, 'Failed to delete user.'));
    },
  });

  const openCreate = () => {
    setFormError(null);
    setIsCreateOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    setFormError(null);
    setEditingUser(user);
  };

  const rows = users ?? [];

  return (
    <div className="h-full">
      {isCreateOpen && (
        <UserFormModal
          error={formError}
          isLoading={createMutation.isPending}
          onClose={() => {
            if (!createMutation.isPending) setIsCreateOpen(false);
          }}
          onSubmit={async (values) => {
            await createMutation.mutateAsync(values);
          }}
        />
      )}

      {editingUser && (
        <UserFormModal
          user={editingUser}
          error={formError}
          isLoading={updateMutation.isPending}
          onClose={() => {
            if (!updateMutation.isPending) setEditingUser(null);
          }}
          onSubmit={async (values) => {
            await updateMutation.mutateAsync(values);
          }}
        />
      )}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="mb-1 text-headline-lg font-semibold text-on-surface">
            Users
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Manage admin accounts through a project permission context.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeProjectId}
            onChange={(event) => setSelectedProjectId(event.target.value)}
            disabled={isProjectsLoading || !projects?.length}
            className="h-8 min-w-[240px] rounded border border-outline-variant bg-surface-container-lowest px-2 text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/40 disabled:opacity-50"
          >
            {projects?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => refetch()}
            disabled={!activeProjectId || isUsersLoading}
            className="flex h-8 items-center gap-1.5 rounded border border-outline-variant px-3 text-body-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isUsersLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={openCreate}
            disabled={!activeProjectId}
            className="flex h-8 items-center gap-1.5 rounded bg-primary px-3 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Create User
          </button>
        </div>
      </div>

      {selectedProject && (
        <div className="mb-4 flex items-center gap-2 rounded border border-outline-variant bg-surface-container-lowest p-3 text-body-sm text-on-surface-variant">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>
            Permission context: <strong className="text-on-surface">{selectedProject.name}</strong>
          </span>
        </div>
      )}

      {actionError && (
        <p className="mb-4 rounded border border-error/20 bg-error/10 p-2 text-body-sm text-error">
          {actionError}
        </p>
      )}

      <div className="min-h-[420px] rounded border border-outline-variant bg-surface-container-lowest">
        {isProjectsLoading || isUsersLoading ? (
          <div className="flex h-[420px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !projects?.length ? (
          <div className="flex h-[420px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-surface-container-low">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-label-md font-medium uppercase text-on-surface">
              No Project Context
            </h3>
            <p className="max-w-sm text-body-sm text-outline">
              Create a project first, then use it as the permission context for user management.
            </p>
          </div>
        ) : isUsersError ? (
          <div className="flex h-[420px] flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-body-sm text-error">
              Failed to load users for the selected project.
            </p>
            <button
              onClick={() => refetch()}
              className="h-8 rounded border border-outline-variant px-3 text-body-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Retry
            </button>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex h-[420px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-surface-container-low">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-label-md font-medium uppercase text-on-surface">
              No Users Found
            </h3>
            <p className="mb-4 max-w-sm text-body-sm text-outline">
              Add an admin user to manage access for the workspace.
            </p>
            <button
              onClick={openCreate}
              className="flex h-8 items-center rounded border border-outline-variant bg-surface-container-lowest px-4 text-body-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Create User
            </button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-body-sm tabular-nums">
              <thead className="border-b border-outline-variant bg-[#F1F5F9] text-label-md font-medium uppercase text-outline">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-on-surface-variant">
                {rows.map((user) => {
                  const isSelf = currentUser?.id === user.id;
                  return (
                    <tr key={user.id} className="transition-colors hover:bg-surface">
                      <td className="px-3 py-2 font-medium text-on-surface">
                        {user.firstName} {user.lastName}
                        {isSelf && (
                          <span className="ml-2 rounded bg-surface-container px-1.5 py-0.5 text-label-sm text-outline">
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">{user.email}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-label-sm font-semibold ${STATUS_STYLES[user.status]}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">{formatDate(user.createdAt)}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            className="flex h-6 items-center gap-1 rounded px-2 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${user.firstName} ${user.lastName}"?`)) {
                                setDeletingId(user.id);
                                deleteMutation.mutate(user.id);
                              }
                            }}
                            disabled={isSelf || deletingId === user.id}
                            title={isSelf ? 'You cannot delete your own account' : 'Delete user'}
                            className="flex h-6 items-center gap-1 rounded px-2 text-label-md text-error transition-colors hover:bg-error-container hover:text-on-error-container disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {deletingId === user.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
