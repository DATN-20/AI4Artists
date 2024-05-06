import { Button } from "@/components/ui/button"

const ShapeButton: React.FC<{
  icon: React.ReactNode
  onClick: () => void
  isActive: boolean
}> = ({ icon, onClick, isActive }) => (
  <Button
    className={`mx-1 rounded-xl ${isActive ? "dark:bg-primary" : "dark:bg-white"} dark:hover:bg-primary`}
    onClick={onClick}
  >
    {icon}
  </Button>
)

export default ShapeButton
