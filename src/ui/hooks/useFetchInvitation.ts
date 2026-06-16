import { useCallback, useState } from "react";
import { GenerateInvitation } from "../../core/modules/invitation/use-cases/GenerateInvitation";
import { AcceptInvitation } from "../../core/modules/invitation/use-cases/AcceptInvitation";
import { getInvitationRepository } from "../../core/modules/invitation/infrastructure/factories/InvitationRepositoryFactory";
import { useAuthContext } from "../contexts/auth.context";
import { getErrorMessage } from "../../core/utils/error-messages";

export const useFetchInvitation = () => {
  const { setAuth, token } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [invitationExpiresAt, setInvitationExpiresAt] = useState<string | null>(null);

  const generateInvitation = useCallback(async (restaurantId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const repository = getInvitationRepository();
      const generateInvitationUseCase = GenerateInvitation(repository);
      const response = await generateInvitationUseCase({ restaurantId });

      if (response.success) {
        setInvitationCode(response.data.code);
        setInvitationExpiresAt(response.data.expiresAt);
        return { success: true, code: response.data.code, expiresAt: response.data.expiresAt };
      }
      const errorMessage = getErrorMessage(null, "generateInvitation");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (err) {
      const errorMessage = getErrorMessage(err, "generateInvitation");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Usado en el flujo OAuth: el usuario ya está autenticado y acepta una invitación
  // para vincularse como empleado a un restaurante existente.
  // Requiere POST /api/v1/invitations/accept en el backend.
  const acceptInvitation = useCallback(async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const repository = getInvitationRepository();
      const acceptInvitationUseCase = AcceptInvitation(repository);
      const response = await acceptInvitationUseCase({ code });

      if (response.success) {
        const { user, token: newToken } = response.data;
        const activeToken = newToken || token || "";
        if (newToken) sessionStorage.setItem("auth-token", newToken);
        setAuth(user, activeToken, user.restaurantId);
        return { success: true };
      }
      const errorMessage = getErrorMessage(null, "acceptInvitation");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (err) {
      const errorMessage = getErrorMessage(err, "acceptInvitation");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [token, setAuth]);

  const clearInvitation = useCallback(() => {
    setInvitationCode(null);
    setInvitationExpiresAt(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    invitationCode,
    invitationExpiresAt,
    generateInvitation,
    acceptInvitation,
    clearInvitation,
  };
};
