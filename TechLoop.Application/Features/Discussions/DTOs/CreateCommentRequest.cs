namespace TechLoop.API.Contracts.Discussions;

public sealed record CreateCommentRequest(
    int? ParentCommentId,
    string Content
);