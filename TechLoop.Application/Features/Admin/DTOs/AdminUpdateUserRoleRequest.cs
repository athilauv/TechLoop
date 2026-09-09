namespace TechLoop.Application.Features.Admin.DTOs;

public sealed class AdminUpdateUserRoleRequest
{
    public int RoleId { get; set; }
    public int? TechnologyId { get; set; }
}
