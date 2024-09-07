import numpy as np

class Object2D:
    def update(self):
        """
        Feed in state as 3x1 array in the following order: pos,vel,acc
        """
        self.data[0:2,self.logCount] = self.pos
        self.data[2:4,self.logCount] = self.vel
        self.data[4:6,self.logCount] = self.acc
        self.logCount += 1

        #extend np array if full
        if self.logCount % self.bufferSize == 0:
            self.data = np.append(self.data,np.zeros((6,self.bufferSize)))

    def __init__(self,initPos=np.zeros(2),initVel=np.zeros(2),initAcc=np.zeros(2),bufferSize=100):
        """
        Creates base 2D object with initial position and velocity as arguments.
        """
        self.pos = initPos
        self.vel = initVel
        self.acc = initAcc

        #logging
        self.logCount = 0
        self.bufferSize = bufferSize
        self.data = np.zeros((6,self.bufferSize)) #posX,posY,velX,velY,accX,accY
        
    def getState(self, count=0):
        """
        Gets object state stored in its log. The count argument is used to fetch previous log values.
        """
        if count > self.logCount:
            msg = f"No data before t=0! (count={count})"
            raise IndexError(msg)
        elif count < 0:
            msg = f"No data in the future! (count={count})"
            raise IndexError(msg)
        
        return self.data[:,self.logCount-count]

    def accelerate(self, xAcc, yAcc, dt):
        """
        Accelerates instance uniformly for dt seconds.
        """
        self.acc[:] = [xAcc,yAcc]
        self.vel += self.acc*dt
        self.pos += self.vel*dt+0.5*self.acc*dt**2
        self.update()

    def move(self,dt):
        """
        Moves object with constant speed and direction.
        """
        self.acc = np.zeros(2)
        self.pos += self.vel*dt
        self.update()
        
        

if __name__ == "__main__":
    testObj = Object2D()
    print(testObj.getState())
