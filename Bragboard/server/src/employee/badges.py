def get_badges(employee_list):
    """
    Badge system based on leaderboard (sorted by shouts sent), not fixed numbers.
    """

    # Step 1: Sort employees by 'sent' (most shouts first)
    employee_list.sort(key=lambda x: x["sent"], reverse=True)

    # Step 2: Assign badges based on sorted order and impact
    for position, emp in enumerate(employee_list):
        badges = []

        # 👑 Top shout givers get special badges (relative position based)
        if position == 0:
            badges.append("Top Sender")
            badges.append("Leaderboard Champion 👑")
        elif position == 1:
            badges.append("High Impact Sender")
        elif position == 2:
            badges.append("Elite Sender")
        elif position <= 5:
            badges.append("Top Contributor")
        elif position <= 10:
            badges.append("Active Contributor")
        else:
            badges.append("Contributor")

        # ⭐ Impact badges based on comparison
        if emp["received"] >= max(10, emp["sent"] * 0.4):  # well-recognized relative to effort
            badges.append("Most Valued Star")
        elif emp["received"] >= emp["sent"] * 0.2:
            badges.append("Appreciated Member")

        # 🎯 Team interaction badges relative to top members
        if emp["tagged"] >= max(5, employee_list[0]["tagged"] * 0.5):
            badges.append("Tag Magnet")
        elif emp["tagged"] >= emp["sent"] * 0.3:
            badges.append("Team Favorite")

        # 🔥 Engagement badges
        if emp["reactions_earned"] >= max(30, employee_list[0]["reactions_earned"] * 0.4):
            badges.append("Reaction Collector")
        if emp["comments_written"] >= max(10, employee_list[0]["comments_written"] * 0.3):
            badges.append("Active Communicator")

        # 🧡 Seniority badges
        if emp["tenure_days"] >= employee_list[0]["tenure_days"]:
            badges.append("Loyal Legend")

        # 🧑‍💼 Leadership badges
        if emp["role"] in ["admin", "manager"]:
            badges.append("Team Leader")
            if position == 0:
                badges.append("Inspiring Leader 🌟")
            if emp["received"] >= employee_list[0]["received"] * 0.7:
                badges.append("Respected Leader")

        # Manager spotlight based on seniority relative to team
        if emp["role"] == "manager" and emp["tenure_days"] > employee_list[0]["tenure_days"] * 0.8:
            badges.append("Leadership Spotlight")

        emp["badges"] = badges
    return employee_list