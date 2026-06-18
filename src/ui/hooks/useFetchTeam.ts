import { useCallback, useState } from "react";
import { ListEmployees } from "../../core/modules/team/use-cases/ListEmployees";
import { RevokeEmployee } from "../../core/modules/team/use-cases/RevokeEmployee";
import { getTeamRepository } from "../../core/modules/team/infrastructure/factories/TeamRepositoryFactory";
import type { Employee } from "../../core/modules/team/domain/models/Team";
import { getErrorMessage } from "../../core/utils/error-messages";

export const useFetchTeam = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchEmployees = useCallback(async (restaurantId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const listEmployeesUseCase = ListEmployees(getTeamRepository());
      const response = await listEmployeesUseCase(restaurantId);
      // El backend puede devolver `null` cuando no hay empleados; normalizamos.
      const data = response.data ?? [];
      setEmployees(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage = getErrorMessage(err, "listEmployees");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revokeEmployee = useCallback(
    async (restaurantId: string, employeeId: string) => {
      try {
        setRevokingId(employeeId);
        setError(null);

        const revokeEmployeeUseCase = RevokeEmployee(getTeamRepository());
        await revokeEmployeeUseCase(restaurantId, employeeId);
        setEmployees((prev) => prev.filter((e) => e.id !== employeeId));
        return { success: true };
      } catch (err) {
        const errorMessage = getErrorMessage(err, "revokeEmployee");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setRevokingId(null);
      }
    },
    [],
  );

  return {
    employees,
    isLoading,
    error,
    revokingId,
    fetchEmployees,
    revokeEmployee,
  };
};
