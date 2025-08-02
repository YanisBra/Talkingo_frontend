import { render, screen } from "@testing-library/react";
import GroupsMemberPanel from "@/features/admin/GroupMembersPanel";
import * as groupsService from "@/services/groupsService";
import { vi } from "vitest";

vi.mock("@/services/groupsService");

describe("GroupMembersPanel", () => {
  const mockGroup = {
    id: 1,
    name: "Test Group",
  };

  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders members list", async () => {
    groupsService.getGroupMembers.mockResolvedValueOnce({
      member: [
        {
          id: 101,
          user: { id: 7 },
          joinedAt: new Date("2025-01-01T12:00:00Z").toISOString(),
        },
      ],
    });

    render(<GroupsMemberPanel group={mockGroup} onBack={onBack} />);

    expect(await screen.findByText('Members of "Test Group"')).toBeInTheDocument();
    expect(screen.getByText("101")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });
});