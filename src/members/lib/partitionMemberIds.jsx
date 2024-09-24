const partitionMemberIds = members =>
  members.reduce(
    (acc, member) => {
      const inactive = member.toString().charAt(0) === 'i'

      return {
        active: !inactive ? [...acc.active, member] : acc.active,
        inactive: inactive ? [...acc.inactive, member] : acc.inactive,
      }
    },
    {
      active: [],
      inactive: [],
    }
  )

export default partitionMemberIds
