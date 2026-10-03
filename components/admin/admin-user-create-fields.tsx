"use client";
import Field from "@/components/ui/field";
import Select from "@/components/ui/select";
import TextInput from "@/components/ui/text-input";
import { ADMIN_USER_NAME_MAX } from "@/lib/admin/constants";
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from "@/lib/auth/constants";
import { ADMIN_USERS_COPY, USER_ROLE_LABELS } from "@/lib/data/admin/users";
import type { CreateUserField, CreateUserForm } from "@/lib/types";
import { userRoleSchema } from "@/lib/validations/admin-users";

interface Props {
    values: CreateUserForm;
    errors: Partial<Record<CreateUserField, string>>;
    readOnly: boolean;
    onChange: (field: CreateUserField, value: string) => void;
}

const COPY = ADMIN_USERS_COPY.dialog.fields;

const TEXT_FIELDS = [
    {
        name: "fullName",
        type: "text",
        autoComplete: "off",
        maxLength: ADMIN_USER_NAME_MAX,
    },
    {
        name: "email",
        type: "email",
        autoComplete: "off",
        maxLength: EMAIL_MAX_LENGTH,
    },
    {
        name: "password",
        type: "password",
        autoComplete: "new-password",
        maxLength: PASSWORD_MAX_LENGTH,
    },
] as const;

export default function AdminUserCreateFields({
    values,
    errors,
    readOnly,
    onChange,
}: Props) {
    return (
        <>
            {TEXT_FIELDS.map(({ name, ...input }) => (
                <Field
                    key={name}
                    label={COPY[name].label}
                    hint={
                        name === "password" && !errors.password
                            ? COPY.password.hint
                            : undefined
                    }
                    error={errors[name]}
                >
                    {(control) => (
                        <TextInput
                            {...control}
                            {...input}
                            name={name}
                            value={values[name]}
                            readOnly={readOnly}
                            onChange={(event) =>
                                onChange(name, event.target.value)
                            }
                        />
                    )}
                </Field>
            ))}
            <Field label={COPY.role.label} error={errors.role}>
                {(control) => (
                    <Select
                        {...control}
                        name="role"
                        value={values.role}
                        disabled={readOnly}
                        onChange={(event) =>
                            onChange("role", event.target.value)
                        }
                    >
                        {userRoleSchema.options.map((role) => (
                            <option key={role} value={role}>
                                {USER_ROLE_LABELS[role].label}
                            </option>
                        ))}
                    </Select>
                )}
            </Field>
        </>
    );
}
