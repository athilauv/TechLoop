type AnyRecord = Record<string, any>;

export class ClientValidationError extends Error {
    readonly isClientValidation = true;

    constructor(message: string) {
        super(message);
        this.name = "ClientValidationError";
    }
}

const text = (value: unknown): string =>
    typeof value === "string" ? value : value == null ? "" : String(value);

const isEmpty = (value: unknown): boolean => text(value).trim().length === 0;
const isPositive = (value: unknown): boolean =>
    typeof value === "number" && Number.isFinite(value) && value > 0;
const isNonNegative = (value: unknown): boolean =>
    typeof value === "number" && Number.isFinite(value) && value >= 0;
const max = (value: unknown, length: number): boolean =>
    isEmpty(value) || text(value).length <= length;
const isEmail = (value: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isMentorEmail = (value: string): boolean =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}$/.test(value);
const isUrl = (value: string): boolean => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const first = (...messages: Array<string | null | undefined>): string | null =>
    messages.find(Boolean) ?? null;

const requireText = (value: unknown, message: string): string | null =>
    isEmpty(value) ? message : null;

const requirePositive = (value: unknown, message: string): string | null =>
    !isPositive(value) ? message : null;

const validatePassword = (
    value: unknown,
    field: string,
): string | null => {
    const password = text(value);
    return first(
        isEmpty(password) ? `${field} is required.` : null,
        password.length < 8 ? `${field} must be at least 8 characters.` : null,
        !/[A-Z]/.test(password)
            ? `${field} must contain an uppercase letter.`
            : null,
        !/[a-z]/.test(password)
            ? `${field} must contain a lowercase letter.`
            : null,
        !/[0-9]/.test(password)
            ? `${field} must contain a digit.`
            : null,
        !/[^a-zA-Z0-9]/.test(password)
            ? `${field} must contain a special character.`
            : null,
    );
};

function validateMentorCreate(data: AnyRecord): string | null {
    return first(
        requireText(data.name, "Username is required."),
        !isEmpty(data.name) && !max(data.name, 100)
            ? "Username must not exceed 100 characters."
            : null,
        requireText(data.email, "Email is required."),
        !isEmpty(data.email) && data.email !== text(data.email).trim()
            ? "Email cannot contain leading or trailing spaces."
            : null,
        !isEmpty(data.email) && !isEmail(text(data.email))
            ? "Please enter a valid email address."
            : null,
        !isEmpty(data.email) && !isMentorEmail(text(data.email))
            ? "Invalid email format."
            : null,
        requirePositive(data.technologyId, "Technology is required."),
    );
}

function validateTechnology(data: AnyRecord): string | null {
    return first(
        requirePositive(data.categoryId, "Category is required."),
        requireText(data.name, "Name is required."),
        !max(data.name, 500) ? "Name must not exceed 500 characters." : null,
        requireText(data.description, "Description is required."),
        !max(data.description, 100000)
            ? "Description must not exceed 100000 characters."
            : null,
        !max(data.imageUrl, 500)
            ? "Image URL must not exceed 500 characters."
            : null,
        !isPositive(data.position)
            ? "Position is required and must be greater than or equal to 0."
            : null,
    );
}

function validateCategory(data: AnyRecord, update = false): string | null {
    const limit = update ? 100 : 500;
    return first(
        requireText(data.name, "Name is required."),
        !max(data.name, limit)
            ? `Name must not exceed ${limit} characters.`
            : null,
    );
}

function validateTopic(data: AnyRecord, update = false): string | null {
    return first(
        requirePositive(data.technologyId, "Technology is required."),
        requireText(data.title, "Title is required."),
        !max(data.title, 100)
            ? "Title must not exceed 100 characters."
            : null,
        requireText(data.slug, "Slug is required."),
        !max(data.slug, 150)
            ? "Slug must not exceed 150 characters."
            : null,
        requireText(data.description, "Description is required."),
        !max(data.imageUrl, 255)
            ? "Image URL must not exceed 255 characters."
            : null,
        !isNonNegative(data.position)
            ? "Position must be greater than or equal to 0."
            : null,
        update && !isPositive(data.id)
            ? "Topic id must be greater than 0."
            : null,
    );
}

function validateSubTopic(data: AnyRecord, update = false): string | null {
    return first(
        requirePositive(data.topicId, "Topic Id is required."),
        requireText(data.title, "Title is required."),
        !max(data.title, update ? 200 : 500)
            ? `Title must not exceed ${update ? 200 : 500} characters.`
            : null,
        requireText(data.slug, "Slug is required."),
        requireText(data.description, "Description is required."),
        !max(data.imageUrl, 500)
            ? "Image URL must not exceed 500 characters."
            : null,
        !isPositive(data.position)
            ? "Position must be greater than 0."
            : null,
    );
}

function validateQuestion(data: AnyRecord, update = false): string | null {
    const type = Number(data.questionType);
    const difficulty = Number(data.difficulty);

    return first(
        requirePositive(data.subTopicId, "Sub topic is required."),
        ![1, 2, 3].includes(type) ? "Question type is invalid." : null,
        requireText(data.title, update ? "Title cannot be empty" : "Title is required."),
        !max(data.title, 200) ? "Title cannot exceed 200 characters" : null,
        requireText(data.slug, update ? "Slug cannot be empty" : "Slug is required."),
        !max(data.slug, 200) ? "Slug cannot exceed 200 characters" : null,
        requireText(
            data.description,
            update ? "Description cannot be empty" : "Description is required.",
        ),
        update
            ? !isNonNegative(data.mark)
                ? "Mark must be greater than or equal 0"
                : null
            : !isPositive(data.mark)
                ? "Mark must be greater than 0."
                : null,
        !isPositive(data.position) ? "Position must be greater than 0" : null,
        ![1, 2, 3, 4, 5].includes(difficulty)
            ? "Difficulty is invalid."
            : null,
        update && data.timeLimitSeconds != null && !isNonNegative(data.timeLimitSeconds)
            ? "TimeLimitSeconds must be greater than or equal 0"
            : null,
        update && data.memoryLimitMb != null && !isNonNegative(data.memoryLimitMb)
            ? "MemoryLimitMb must be greater than or equal 0"
            : null,
        update && data.memoryLimitMb == null
            ? "MemoryLimitMb cannot be empty"
            : null,
        type === 2 && !isPositive(data.timeLimitSeconds)
            ? "Time limit is required for coding questions."
            : null,
        type === 2 && !isPositive(data.memoryLimitMb)
            ? "Memory limit is required for coding questions."
            : null,
    );
}

function validateCodingTemplate(data: AnyRecord, update = false): string | null {
    return first(
        update && !isPositive(data.id)
            ? "Coding template id is required."
            : null,
        requirePositive(data.questionId, "Question is required."),
        requirePositive(data.technologyId, "Technology is required."),
        requireText(data.starterCode, "Starter code is required."),
        !max(data.starterCode, 50000)
            ? "Starter code cannot exceed 50000 characters."
            : null,
        !max(data.solutionCode, 50000)
            ? "Solution code cannot exceed 50000 characters."
            : null,
    );
}

function validateTestCase(data: AnyRecord, update = false): string | null {
    return first(
        update && !isPositive(data.id)
            ? "Test case id is required."
            : null,
        !update ? requirePositive(data.questionId, "Question is required.") : null,
        !update && data.input == null ? "Input is required." : null,
        !update && data.expectedOutput == null ? "Expected output is required." : null,
        update && isEmpty(data.input) ? "Input is required." : null,
        update && isEmpty(data.expectedOutput) ? "Expected output is required." : null,
        !isPositive(data.position)
            ? "Position must be greater than zero."
            : null,
    );
}

function validateMcqOption(data: AnyRecord, update = false): string | null {
    return first(
        !update ? requirePositive(data.questionId, "Question is required.") : null,
        requireText(data.optionText, "OptionText cannot be empty."),
        !max(data.optionText, 500)
            ? "OptionText cannot exceed 500 characters."
            : null,
        !isPositive(data.position)
            ? "Position must be greater than 0."
            : null,
    );
}

function validateDiscussion(data: AnyRecord, update = false): string | null {
    return first(
        !update ? requirePositive(data.questionId, "Question is required.") : null,
        update && !isPositive(data.id) ? "Invalid discussion id." : null,
        requireText(data.title, "Title is required."),
        !max(data.title, 200) ? "Title must not exceed 200 characters." : null,
        requireText(data.content, "Content is required."),
        !update && !max(data.content, 5000)
            ? "Content must not exceed 5000 characters."
            : null,
    );
}

function validateComment(data: AnyRecord, update = false): string | null {
    return first(
        !update ? requirePositive(data.postId ?? data.discussionId, "Post/Discussion id is required.") : null,
        update && !isPositive(data.id) ? "Invalid comment." : null,
        requireText(data.content, "Content is required."),
        !max(data.content, update ? 2000 : 1000)
            ? `Content must not exceed ${update ? 2000 : 1000} characters.`
            : null,
        data.parentCommentId != null && !isPositive(data.parentCommentId)
            ? "ParentCommentId must be greater than 0."
            : null,
    );
}

function validateCommunityPost(data: AnyRecord): string | null {
    return first(
        requireText(data.title, "Title is required."),
        !max(data.title, 200) ? "Title must not exceed 200 characters." : null,
        requireText(data.content, "Content is required."),
        data.technologyId != null && !isPositive(data.technologyId)
            ? "Technology ID must be greater than 0"
            : null,
    );
}

function validateSubmission(data: AnyRecord): string | null {
    return first(
        data.userId !== undefined && isEmpty(data.userId) ? "UserId is required." : null,
        requirePositive(data.questionId, "Question id is required."),
        requirePositive(data.technologyId, "Technology id is required."),
        requireText(data.sourceCode, "Source code is required."),
        !max(data.sourceCode, 100000)
            ? "Source code cannot exceed 100000 characters."
            : null,
    );
}

function validateAuth(path: string, data: AnyRecord): string | null {
    if (path.endsWith("/login")) {
        return first(
            requireText(data.email, "Email is required."),
            !isEmpty(data.email) && !isEmail(text(data.email))
                ? "Please enter a valid email address."
                : null,
            requireText(data.password, "Password is required."),
        );
    }

    if (path.endsWith("/register")) {
        return first(
            requireText(data.username, "Username is required."),
            text(data.username).trim().length < 3
                ? "Username must be at least 3 characters."
                : null,
            requireText(data.email, "Email is required."),
            text(data.email) !== text(data.email).trim()
                ? "Email cannot contain leading or trailing spaces."
                : null,
            !isEmpty(data.email) && !isMentorEmail(text(data.email))
                ? "Invalid email format."
                : null,
            validatePassword(data.password, "Password"),
        );
    }

    if (path.endsWith("/change-password")) {
        return first(
            requireText(data.currentPassword, "CurrentPassword is required."),
            validatePassword(data.newPassword, "NewPassword"),
            requireText(data.confirmPassword, "ConfirmPassword is required."),
            data.confirmPassword !== data.newPassword
                ? "Password and Confirm Password do not match."
                : null,
        );
    }

    if (path.endsWith("/forgot-password")) {
        return first(
            requireText(data.email, "Email is required."),
            text(data.email) !== text(data.email).trim()
                ? "Email cannot contain leading or trailing spaces."
                : null,
            !isEmpty(data.email) && !isMentorEmail(text(data.email))
                ? "Invalid email format."
                : null,
        );
    }

    if (path.endsWith("/reset-password")) {
        return first(
            requireText(data.token, "Token is required."),
            validatePassword(data.newPassword, "NewPassword"),
            requireText(data.confirmPassword, "ConfirmPassword is required."),
            data.confirmPassword !== data.newPassword
                ? "Password and Confirm Password do not match."
                : null,
        );
    }

    if (path.endsWith("/mentor-setup")) {
        return first(
            validatePassword(data.password, "Password"),
            requireText(data.confirmPassword, "ConfirmPassword is required."),
            data.confirmPassword !== data.password
                ? "Password and Confirm Password do not match."
                : null,
            validateProfile(data),
        );
    }

    return null;
}

function validateProfile(data: AnyRecord): string | null {
    return first(
        !max(data.phoneNumber, 20) || (!isEmpty(data.phoneNumber) && !/^[0-9+\-\s()]*$/.test(text(data.phoneNumber)))
            ? "Phone number contains invalid characters."
            : null,
        !max(data.bio, 1000) ? "Bio must not exceed 1000 characters." : null,
        !max(data.linkedInUrl, 500) || (!isEmpty(data.linkedInUrl) && !isUrl(text(data.linkedInUrl)))
            ? "Invalid LinkedIn URL."
            : null,
        !max(data.githubUrl, 500) || (!isEmpty(data.githubUrl) && !isUrl(text(data.githubUrl)))
            ? "Invalid GitHub URL."
            : null,
        !max(data.profileImageUrl, 500)
            ? "Profile image URL must not exceed 500 characters."
            : null,
    );
}

function validateContributionReview(data: AnyRecord): string | null {
    const status = Number(data.status);
    return first(
        !isPositive(data.id) ? "Contribution ID must be greater than zero." : null,
        ![2, 3].includes(status) ? "Status must be Approved or Rejected." : null,
        status === 2 && data.position == null
            ? "Position is required when approving a contribution."
            : null,
        status === 2 && data.position != null && !isPositive(data.position)
            ? "Position must be greater than zero."
            : null,
        status === 2 && data.parentSubTopicId != null && !isPositive(data.parentSubTopicId)
            ? "ParentSubTopicId must be greater than zero."
            : null,
        status === 3 && data.position != null
            ? "Position should not be provided when rejecting a contribution."
            : null,
        status === 3 && data.parentSubTopicId != null
            ? "ParentSubTopicId should not be provided when rejecting a contribution."
            : null,
        !max(data.reviewNotes, 2000)
            ? "ReviewNotes must not exceed 2000 characters."
            : null,
    );
}

function validateSubmissionResult(data: AnyRecord): string | null {
    const values = [
        ["totalTestCases", "TotalTestCases"],
        ["passedTestCases", "PassedTestCases"],
        ["score", "Score"],
        ["executionTimeMs", "ExecutionTimeMs"],
        ["memoryUsedMb", "MemoryUsedMb"],
    ] as const;

    return first(
        !isPositive(data.id) ? "Id must be greater than 0." : null,
        ...values.map(([key, label]) =>
            data[key] != null && !isNonNegative(data[key])
                ? `${label} must be greater than or equal to 0`
                : null,
        ),
    );
}

function validateRequest(method: string, rawUrl: string, data: AnyRecord): string | null {
    const url = rawUrl.split("?")[0].replace(/^https?:\/\/[^/]+/i, "").replace(/^\/+/, "").toLowerCase();
    const m = method.toUpperCase();

    if (url.startsWith("auth/")) return validateAuth(url, data);
    if (url.startsWith("api/judge0/run")) {
        return first(
            data.request == null ? "Request is required." : null,
            data.request?.questionId !== undefined
                ? requirePositive(data.request.questionId, "A valid question is required.")
                : null,
            requireText(data.request?.sourceCode, "Source code is required."),
        );
    }
    if (url.startsWith("api/judge0/submit")) {
        return first(
            data.request == null ? "Request is required." : null,
            requireText(data.request?.sourceCode, "Source code is required."),
            requirePositive(data.request?.languageId, "A valid language is required."),
        );
    }

    const idInPath = Number((url.match(/\/(\d+)(?:\/|$)/)?.[1] ?? 0));

    if (url.startsWith("admin/mentors") && m === "POST") return validateMentorCreate(data);
    if (url.startsWith("admin/technologies") && m === "POST") return validateTechnology(data);
    if (url.startsWith("admin/technologies/") && m === "PUT") return validateTechnology(data);
    if (url === "admin/technology-categories" && m === "POST") return validateCategory(data);
    if (url.startsWith("admin/technology-categories/") && m === "PUT") return validateCategory(data, true);

    if (url.startsWith("mentor/profile") && m === "PUT") return validateProfile(data);
    if (url.startsWith("mentor/topics") && m === "POST") return validateTopic(data);
    if (url.match(/^mentor\/topics\/\d+$/) && m === "PUT") return validateTopic(data, true);
    if (url.startsWith("mentor/subtopics") && m === "POST") return validateSubTopic(data);
    if (url.match(/^mentor\/subtopics\/\d+$/) && m === "PUT") return validateSubTopic(data, true);
    if (url.match(/^mentor\/questions\/\d+\/mcq_options$/) && m === "POST") {
        return validateMcqOption({ ...data, questionId: idInPath });
    }
    if (url.match(/^mentor\/mcq-options\/\d+$/) && m === "PUT") {
        return validateMcqOption(data, true);
    }
    if (url.match(/^mentor\/questions\/\d+\/coding-templates$/) && m === "POST") {
        return validateCodingTemplate({ ...data, questionId: idInPath });
    }
    if (url.match(/^mentor\/coding-templates\/\d+$/) && m === "PUT") {
        return validateCodingTemplate({ ...data, id: idInPath }, true);
    }
    if (url.match(/^mentor\/questions\/\d+\/test-cases$/) && m === "POST") {
        return validateTestCase({ ...data, questionId: idInPath });
    }
    if (url.match(/^mentor\/test-cases\/\d+$/) && m === "PUT") {
        return validateTestCase({ ...data, id: idInPath }, true);
    }
    if (url.startsWith("mentor/questions") && m === "POST") return validateQuestion(data);
    if (url.match(/^mentor\/questions\/\d+$/) && m === "PUT") {
        return validateQuestion({ ...data, id: idInPath }, true);
    }

    if (url.match(/^mentor\/posts(?:\/\d+)?$/) && (m === "POST" || m === "PUT")) return validateCommunityPost(data);
    if (url.match(/^mentor\/posts\/\d+\/comments$/) && m === "POST") return validateComment(data);
    if (url.match(/^mentor\/comments\/\d+$/) && m === "PUT") return validateComment(data, true);
    if (url.match(/^mentor\/discussions\/\d+\/(?:pin|unpin)$/) && m === "PATCH") return requirePositive(idInPath, "Discussion id must be greater than 0.");
    if (url.match(/^mentor\/discussions\/\d+$/) && m === "DELETE") return requirePositive(idInPath, "Invalid discussion id.");

    if (url.startsWith("api/discussions") && m === "POST" && !url.includes("/comments")) return validateDiscussion(data);
    if (url.match(/^api\/discussions\/\d+$/) && m === "PUT") return validateDiscussion({ ...data, id: idInPath }, true);
    if (url.match(/^api\/discussions\/\d+$/) && m === "DELETE") return requirePositive(idInPath, "Invalid discussion id.");
    if (url.match(/^api\/discussions\/\d+\/comments$/) && m === "POST") return validateComment(data);
    if (url.match(/^api\/discussions\/comments\/\d+$/) && m === "PUT") return validateComment(data, true);
    if (url.match(/^api\/discussions\/comments\/\d+$/) && m === "DELETE") return requirePositive(idInPath, "Invalid comment.");

    if (url.includes("/community/posts") && (m === "POST" || m === "PUT")) {
        if (url.includes("/comments")) return validateComment(data);
        return validateCommunityPost(data);
    }

    if (url.includes("/likes") || url.includes("/save")) {
        return requirePositive(idInPath, "Post id must be greater than 0.");
    }

    if (url.startsWith("api/submissions/mcq") && m === "POST") {
        return first(
            requirePositive(data.questionId, "Question id is required."),
            requirePositive(data.technologyId, "Technology id is required."),
            requirePositive(data.selectedOptionId, "Selected option id is required."),
        );
    }

    if (url === "api/submissions" && m === "POST") return validateSubmission(data);

    if (url.startsWith("api/topic-contributions") && m === "POST") {
        return first(
            requirePositive(data.technologyId, "Technology is required."),
            requireText(data.title, "Title is required."),
            !max(data.title, 255) ? "Title must not exceed 255 characters." : null,
            requireText(data.description, "Description is required."),
            !max(data.referenceUrl, 500) ? "ReferenceUrl must not exceed 500 characters." : null,
            !max(data.example, 5000) ? "Example must not exceed 5000 characters." : null,
        );
    }

    if (url.match(/^mentor\/topic-contributions\/\d+\/review$/) && m === "PUT") {
        return validateContributionReview({ ...data, id: data.id ?? idInPath });
    }

    if (url.match(/^mentor\/submissions\/\d+\/result$/) && m === "PUT") {
        return validateSubmissionResult({ ...data, id: data.id ?? idInPath });
    }

    if (m === "DELETE" && idInPath <= 0) {
        return "Id must be greater than 0.";
    }

    return null;
}

export const getBackendValidationMessage = (
    method: string,
    url: string,
    data: unknown,
): string | null => {
    if (data == null || typeof data !== "object") return null;
    return validateRequest(method, url, data as AnyRecord);
};

export const assertBackendValidation = (
    method: string,
    url: string,
    data: unknown,
): void => {
    const message = getBackendValidationMessage(method, url, data);
    if (message) throw new ClientValidationError(message);
};

export const validateMentorCreateForm = (data: {
    name: string;
    email: string;
    technologyId: number;
}): string | null => validateMentorCreate(data);
